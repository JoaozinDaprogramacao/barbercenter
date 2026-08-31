import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { audit, requirePlatformActor } from "@/lib/platform/auth";
import { affiliateLink } from "@/lib/platform/affiliate";
import {
    AFFILIATE_STATUS,
    isValidAffiliateCode,
    normalizeAffiliateCode,
} from "@/lib/platform/constants";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const gate = await requirePlatformActor();
    if (gate.error) return gate.error;

    try {
        const url = new URL(req.url);
        const status = url.searchParams.get("status");
        const search = url.searchParams.get("q")?.trim();

        const affiliates = await prisma.affiliate.findMany({
            where: {
                ...(status && (AFFILIATE_STATUS as readonly string[]).includes(status)
                    ? { status }
                    : {}),
                ...(search
                    ? {
                        OR: [
                            { name: { contains: search } },
                            { email: { contains: search } },
                            { code: { contains: normalizeAffiliateCode(search) } },
                        ],
                    }
                    : {}),
            },
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { clicks: true, referrals: true } },
            },
        });

        // Agregados por afiliado em duas queries, em vez de N+1 dentro do map.
        const [commissionRows, activeReferralRows] = await Promise.all([
            prisma.commission.groupBy({
                by: ["affiliateId", "status"],
                _sum: { amount: true },
            }),
            prisma.referral.groupBy({
                by: ["affiliateId"],
                where: { status: "ACTIVE" },
                _count: { _all: true },
            }),
        ]);

        const commissionMap = new Map<string, Record<string, number>>();
        for (const row of commissionRows) {
            const entry = commissionMap.get(row.affiliateId) ?? {};
            entry[row.status] = row._sum.amount ?? 0;
            commissionMap.set(row.affiliateId, entry);
        }

        const activeMap = new Map(activeReferralRows.map((r) => [r.affiliateId, r._count._all]));

        return NextResponse.json({
            affiliates: affiliates.map((a) => {
                const commissions = commissionMap.get(a.id) ?? {};
                return {
                    id: a.id,
                    code: a.code,
                    link: affiliateLink(a.code),
                    name: a.name,
                    email: a.email,
                    phone: a.phone,
                    instagram: a.instagram,
                    pixKey: a.pixKey,
                    pixKeyType: a.pixKeyType,
                    commissionPercent: a.commissionPercent,
                    status: a.status,
                    notes: a.notes,
                    createdAt: a.createdAt,
                    clicks: a._count.clicks,
                    signups: a._count.referrals,
                    activeReferrals: activeMap.get(a.id) ?? 0,
                    commissionPending: commissions.PENDING ?? 0,
                    commissionApproved: commissions.APPROVED ?? 0,
                    commissionPaid: commissions.PAID ?? 0,
                };
            }),
        });
    } catch (error) {
        console.error("Erro ao listar afiliados:", error);
        return NextResponse.json({ error: "Erro ao listar afiliados" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const gate = await requirePlatformActor("SUPERADMIN");
    if (gate.error) return gate.error;

    try {
        const body = await req.json();
        const name = String(body.name ?? "").trim();
        const email = String(body.email ?? "").trim().toLowerCase();
        const code = normalizeAffiliateCode(body.code ?? "");

        if (!name || !email) {
            return NextResponse.json({ error: "Nome e e-mail são obrigatórios" }, { status: 400 });
        }

        if (!isValidAffiliateCode(code)) {
            return NextResponse.json(
                { error: "Código inválido. Use 3 a 24 caracteres entre A-Z, 0-9 e hífen." },
                { status: 400 }
            );
        }

        // 50% é o padrão do programa; qualquer outro valor é exceção consciente
        // e fica registrado na auditoria.
        const commissionPercent = Number(body.commissionPercent ?? 50);
        if (!Number.isFinite(commissionPercent) || commissionPercent < 0 || commissionPercent > 100) {
            return NextResponse.json({ error: "Percentual deve estar entre 0 e 100" }, { status: 400 });
        }

        const conflict = await prisma.affiliate.findFirst({
            where: { OR: [{ code }, { email }] },
            select: { code: true, email: true },
        });

        if (conflict) {
            return NextResponse.json(
                { error: conflict.code === code ? "Este código já está em uso" : "Este e-mail já está cadastrado" },
                { status: 409 }
            );
        }

        const affiliate = await prisma.affiliate.create({
            data: {
                name,
                email,
                code,
                commissionPercent,
                phone: body.phone ? String(body.phone).trim() : null,
                document: body.document ? String(body.document).trim() : null,
                pixKey: body.pixKey ? String(body.pixKey).trim() : null,
                pixKeyType: body.pixKeyType ? String(body.pixKeyType).trim() : null,
                instagram: body.instagram ? String(body.instagram).trim() : null,
                notes: body.notes ? String(body.notes) : null,
                // Nasce PENDING: o link só passa a atribuir depois da ativação
                // explícita, para não vazar comissão de cadastro incompleto.
                status: "PENDING",
            },
        });

        await audit({
            actor: gate.actor!,
            action: "AFFILIATE_CREATE",
            targetType: "Affiliate",
            targetId: affiliate.id,
            metadata: { code, email, commissionPercent },
            req,
        });

        return NextResponse.json(
            { affiliate: { ...affiliate, link: affiliateLink(affiliate.code) } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao criar afiliado:", error);
        return NextResponse.json({ error: "Erro ao criar afiliado" }, { status: 500 });
    }
}
