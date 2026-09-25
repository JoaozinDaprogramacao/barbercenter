import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { audit, requirePlatformActor } from "@/lib/platform/auth";
import { affiliateLink } from "@/lib/platform/affiliate";
import { AFFILIATE_STATUS } from "@/lib/platform/constants";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const gate = await requirePlatformActor();
    if (gate.error) return gate.error;

    try {
        const { id } = await params;

        const affiliate = await prisma.affiliate.findUnique({
            where: { id },
            include: {
                referrals: {
                    orderBy: { attributedAt: "desc" },
                    include: {
                        barbershop: {
                            select: { id: true, name: true, planStatus: true, planExpiresAt: true, createdAt: true },
                        },
                    },
                },
                commissions: {
                    orderBy: { createdAt: "desc" },
                    take: 100,
                    include: { transaction: { select: { paidAt: true, eventType: true } } },
                },
                payouts: { orderBy: { createdAt: "desc" } },
                _count: { select: { clicks: true } },
            },
        });

        if (!affiliate) {
            return NextResponse.json({ error: "Afiliado não encontrado" }, { status: 404 });
        }

        return NextResponse.json({
            affiliate: {
                ...affiliate,
                link: affiliateLink(affiliate.code),
                clicks: affiliate._count.clicks,
            },
        });
    } catch (error) {
        console.error("Erro ao buscar afiliado:", error);
        return NextResponse.json({ error: "Erro ao buscar afiliado" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const gate = await requirePlatformActor("SUPERADMIN");
    if (gate.error) return gate.error;

    try {
        const { id } = await params;
        const body = await req.json();

        const current = await prisma.affiliate.findUnique({ where: { id } });
        if (!current) return NextResponse.json({ error: "Afiliado não encontrado" }, { status: 404 });

        const data: Record<string, unknown> = {};

        if (body.status !== undefined) {
            if (!(AFFILIATE_STATUS as readonly string[]).includes(body.status)) {
                return NextResponse.json({ error: "Status inválido" }, { status: 400 });
            }
            data.status = body.status;
        }

        if (body.commissionPercent !== undefined) {
            const percent = Number(body.commissionPercent);
            if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
                return NextResponse.json({ error: "Percentual deve estar entre 0 e 100" }, { status: 400 });
            }
            data.commissionPercent = percent;
        }

        for (const field of ["name", "phone", "document", "pixKey", "pixKeyType", "instagram", "notes"]) {
            if (body[field] !== undefined) {
                data[field] = body[field] === null || body[field] === "" ? null : String(body[field]).trim();
            }
        }

        // `code` e `email` ficam de fora de propósito: trocar o código quebra
        // todo link já publicado pelo embaixador e órfã os cliques históricos.

        if (Object.keys(data).length === 0) {
            return NextResponse.json({ error: "Nada para atualizar" }, { status: 400 });
        }

        const affiliate = await prisma.affiliate.update({ where: { id }, data });

        await audit({
            actor: gate.actor!,
            action: "AFFILIATE_UPDATE",
            targetType: "Affiliate",
            targetId: id,
            metadata: {
                changed: Object.keys(data),
                statusFrom: current.status,
                statusTo: affiliate.status,
                percentFrom: current.commissionPercent,
                percentTo: affiliate.commissionPercent,
            },
            req,
        });

        return NextResponse.json({ affiliate: { ...affiliate, link: affiliateLink(affiliate.code) } });
    } catch (error) {
        console.error("Erro ao atualizar afiliado:", error);
        return NextResponse.json({ error: "Erro ao atualizar afiliado" }, { status: 500 });
    }
}
