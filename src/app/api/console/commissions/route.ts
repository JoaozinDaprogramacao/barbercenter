import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { audit, requirePlatformActor } from "@/lib/platform/auth";
import { COMMISSION_STATUS } from "@/lib/platform/constants";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const gate = await requirePlatformActor();
    if (gate.error) return gate.error;

    try {
        const url = new URL(req.url);
        const status = url.searchParams.get("status");
        const affiliateId = url.searchParams.get("affiliateId");
        const competence = url.searchParams.get("competence");
        const take = Math.min(Number(url.searchParams.get("take") ?? 100), 500);

        const where = {
            ...(status && (COMMISSION_STATUS as readonly string[]).includes(status) ? { status } : {}),
            ...(affiliateId ? { affiliateId } : {}),
            ...(competence ? { competence } : {}),
        };

        const [commissions, totals] = await Promise.all([
            prisma.commission.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take,
                include: {
                    affiliate: { select: { id: true, name: true, code: true, pixKey: true, pixKeyType: true } },
                    referral: {
                        select: { barbershop: { select: { id: true, name: true } } },
                    },
                    transaction: { select: { paidAt: true, eventType: true, externalId: true } },
                },
            }),
            prisma.commission.groupBy({
                by: ["status"],
                where,
                _sum: { amount: true },
                _count: { _all: true },
            }),
        ]);

        return NextResponse.json({
            commissions,
            totals: totals.map((t) => ({
                status: t.status,
                amount: t._sum.amount ?? 0,
                count: t._count._all,
            })),
        });
    } catch (error) {
        console.error("Erro ao listar comissões:", error);
        return NextResponse.json({ error: "Erro ao listar comissões" }, { status: 500 });
    }
}

/**
 * Muda o status de um lote de comissões.
 *
 * O fluxo é PENDING → APPROVED → PAID, e só nessa ordem: aprovar é a etapa em
 * que você confere que o pagamento do indicado não foi estornado, e marcar
 * como paga sem ter aprovado antes pularia essa conferência. Pagamento em si
 * é feito via /api/console/payouts, que agrupa e gera o repasse.
 */
export async function PATCH(req: Request) {
    const gate = await requirePlatformActor("SUPERADMIN");
    if (gate.error) return gate.error;

    try {
        const body = await req.json();
        const ids: string[] = Array.isArray(body.ids) ? body.ids.map(String) : [];
        const action = String(body.action ?? "");

        if (ids.length === 0) {
            return NextResponse.json({ error: "Selecione ao menos uma comissão" }, { status: 400 });
        }

        if (action !== "APPROVE" && action !== "REVERSE") {
            return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
        }

        const now = new Date();

        const result =
            action === "APPROVE"
                ? await prisma.commission.updateMany({
                    // Só sai de PENDING: aprovar algo já pago ou estornado seria
                    // reabrir um lançamento fechado.
                    where: { id: { in: ids }, status: "PENDING" },
                    data: { status: "APPROVED", approvedAt: now },
                })
                : await prisma.commission.updateMany({
                    where: { id: { in: ids }, status: { in: ["PENDING", "APPROVED"] } },
                    data: { status: "REVERSED", reversedAt: now },
                });

        await audit({
            actor: gate.actor!,
            action: action === "APPROVE" ? "COMMISSION_APPROVE" : "COMMISSION_REVERSE",
            targetType: "Commission",
            metadata: { ids, requested: ids.length, affected: result.count },
            req,
        });

        return NextResponse.json({ updated: result.count, requested: ids.length });
    } catch (error) {
        console.error("Erro ao atualizar comissões:", error);
        return NextResponse.json({ error: "Erro ao atualizar comissões" }, { status: 500 });
    }
}
