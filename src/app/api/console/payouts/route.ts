import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { audit, requirePlatformActor } from "@/lib/platform/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const gate = await requirePlatformActor();
    if (gate.error) return gate.error;

    try {
        const url = new URL(req.url);
        const affiliateId = url.searchParams.get("affiliateId");

        const payouts = await prisma.affiliatePayout.findMany({
            where: affiliateId ? { affiliateId } : {},
            orderBy: { createdAt: "desc" },
            take: 200,
            include: {
                affiliate: { select: { id: true, name: true, code: true, pixKey: true, pixKeyType: true } },
                _count: { select: { commissions: true } },
            },
        });

        return NextResponse.json({ payouts });
    } catch (error) {
        console.error("Erro ao listar repasses:", error);
        return NextResponse.json({ error: "Erro ao listar repasses" }, { status: 500 });
    }
}

/**
 * Fecha um repasse: junta todas as comissões APPROVED do afiliado, soma,
 * cria o registro de payout e marca as comissões como PAID.
 *
 * Tudo em uma transação — um payout com valor somado de comissões que
 * continuaram APPROVED viraria pagamento duplicado no mês seguinte.
 */
export async function POST(req: Request) {
    const gate = await requirePlatformActor("SUPERADMIN");
    if (gate.error) return gate.error;

    try {
        const body = await req.json();
        const affiliateId = String(body.affiliateId ?? "");

        if (!affiliateId) {
            return NextResponse.json({ error: "Afiliado é obrigatório" }, { status: 400 });
        }

        const affiliate = await prisma.affiliate.findUnique({ where: { id: affiliateId } });
        if (!affiliate) return NextResponse.json({ error: "Afiliado não encontrado" }, { status: 404 });

        const approved = await prisma.commission.findMany({
            where: { affiliateId, status: "APPROVED", payoutId: null },
            select: { id: true, amount: true, createdAt: true },
        });

        if (approved.length === 0) {
            return NextResponse.json(
                { error: "Nenhuma comissão aprovada e em aberto para este afiliado" },
                { status: 400 }
            );
        }

        const amount = Math.round(approved.reduce((sum, c) => sum + c.amount, 0) * 100) / 100;
        const dates = approved.map((c) => c.createdAt.getTime());
        const now = new Date();

        const payout = await prisma.$transaction(async (tx) => {
            const created = await tx.affiliatePayout.create({
                data: {
                    affiliateId,
                    amount,
                    periodStart: new Date(Math.min(...dates)),
                    periodEnd: new Date(Math.max(...dates)),
                    status: "PAID",
                    method: String(body.method ?? "PIX"),
                    reference: body.reference ? String(body.reference).trim() : null,
                    notes: body.notes ? String(body.notes) : null,
                    paidAt: now,
                },
            });

            await tx.commission.updateMany({
                // Repete o filtro de status dentro da transação: se outra aba
                // fechou um repasse no meio do caminho, esta atualização não
                // encosta nas comissões que já saíram.
                where: { id: { in: approved.map((c) => c.id) }, status: "APPROVED", payoutId: null },
                data: { status: "PAID", paidAt: now, payoutId: created.id },
            });

            return created;
        });

        await audit({
            actor: gate.actor!,
            action: "PAYOUT_CREATE",
            targetType: "AffiliatePayout",
            targetId: payout.id,
            metadata: {
                affiliateId,
                affiliateCode: affiliate.code,
                amount,
                commissions: approved.length,
                reference: payout.reference,
            },
            req,
        });

        return NextResponse.json({ payout, commissions: approved.length }, { status: 201 });
    } catch (error) {
        console.error("Erro ao gerar repasse:", error);
        return NextResponse.json({ error: "Erro ao gerar repasse" }, { status: 500 });
    }
}
