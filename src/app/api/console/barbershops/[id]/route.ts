import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { audit, requirePlatformActor } from "@/lib/platform/auth";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const gate = await requirePlatformActor();
    if (gate.error) return gate.error;

    try {
        const { id } = await params;

        const barbershop = await prisma.barbershop.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                phone: true,
                address: true,
                planStatus: true,
                planExpiresAt: true,
                createdAt: true,
                // Nada de senha, hash ou token de reset: o painel da plataforma
                // não precisa disso e o que não é lido não vaza.
                users: { select: { id: true, name: true, email: true, role: true, createdAt: true } },
                _count: { select: { appointments: true, clients: true, services: true, products: true } },
                referral: {
                    include: { affiliate: { select: { id: true, name: true, code: true, status: true } } },
                },
                platformTransactions: { orderBy: { paidAt: "desc" }, take: 24 },
            },
        });

        if (!barbershop) {
            return NextResponse.json({ error: "Barbearia não encontrada" }, { status: 404 });
        }

        const revenue = await prisma.platformTransaction.aggregate({
            where: { barbershopId: id, status: "PAID" },
            _sum: { amount: true },
        });

        return NextResponse.json({
            barbershop: { ...barbershop, lifetimeRevenue: revenue._sum.amount ?? 0 },
        });
    } catch (error) {
        console.error("Erro ao buscar barbearia:", error);
        return NextResponse.json({ error: "Erro ao buscar barbearia" }, { status: 500 });
    }
}

/**
 * Ações operacionais de suporte. Deliberadamente enxutas: só mexem em prazo e
 * status de plano. Nada aqui edita dados da barbearia — pra isso existe o
 * painel do próprio dono, e o admin não deve poder reescrever dado de cliente.
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const gate = await requirePlatformActor("SUPERADMIN");
    if (gate.error) return gate.error;

    try {
        const { id } = await params;
        const body = await req.json();
        const action = String(body.action ?? "");

        const current = await prisma.barbershop.findUnique({
            where: { id },
            select: { id: true, name: true, planStatus: true, planExpiresAt: true },
        });

        if (!current) return NextResponse.json({ error: "Barbearia não encontrada" }, { status: 404 });

        let data: Record<string, unknown>;

        if (action === "EXTEND_TRIAL") {
            const days = Number(body.days);
            if (!Number.isInteger(days) || days < 1 || days > 90) {
                return NextResponse.json({ error: "Informe de 1 a 90 dias" }, { status: 400 });
            }

            // Estende a partir de hoje se já venceu, senão soma ao prazo atual —
            // senão "estender" encurtaria o prazo de quem ainda está em dia.
            const base = current.planExpiresAt > new Date() ? current.planExpiresAt : new Date();
            data = { planExpiresAt: new Date(base.getTime() + days * 24 * 60 * 60 * 1000) };
        } else if (action === "BLOCK") {
            data = { planStatus: "FREE", planExpiresAt: new Date() };
        } else if (action === "GRANT_PRO") {
            const days = Number(body.days ?? 30);
            if (!Number.isInteger(days) || days < 1 || days > 365) {
                return NextResponse.json({ error: "Informe de 1 a 365 dias" }, { status: 400 });
            }
            // Cortesia: não passa por gateway, então não gera transação nem
            // comissão. Afiliado não comissiona sobre acesso que ninguém pagou.
            data = {
                planStatus: "PRO",
                planExpiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
            };
        } else {
            return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
        }

        const updated = await prisma.barbershop.update({ where: { id }, data });

        await audit({
            actor: gate.actor!,
            action: `BARBERSHOP_${action}`,
            targetType: "Barbershop",
            targetId: id,
            metadata: {
                name: current.name,
                from: { planStatus: current.planStatus, planExpiresAt: current.planExpiresAt },
                to: { planStatus: updated.planStatus, planExpiresAt: updated.planExpiresAt },
                reason: body.reason ? String(body.reason) : null,
            },
            req,
        });

        return NextResponse.json({
            barbershop: {
                id: updated.id,
                planStatus: updated.planStatus,
                planExpiresAt: updated.planExpiresAt,
            },
        });
    } catch (error) {
        console.error("Erro ao atualizar barbearia:", error);
        return NextResponse.json({ error: "Erro ao atualizar barbearia" }, { status: 500 });
    }
}
