import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requirePlatformActor } from "@/lib/platform/auth";
import { competenceOf } from "@/lib/platform/constants";

export const dynamic = "force-dynamic";

function daysAgo(n: number) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(0, 0, 0, 0);
    return d;
}

function dateKey(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function GET() {
    const gate = await requirePlatformActor();
    if (gate.error) return gate.error;

    try {
        const now = new Date();
        const last7 = daysAgo(7);
        const last30 = daysAgo(30);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalBarbershops,
            newLast7,
            newLast30,
            planGroups,
            totalUsers,
            totalAppointments,
            appointments30,
            revenue30,
            revenueMonth,
            revenueAllTime,
            signupSeries,
            revenueSeries,
            activeAffiliates,
            totalAffiliates,
            clicks30,
            referralGroups,
            commissionGroups,
            missGroups,
        ] = await Promise.all([
            prisma.barbershop.count(),
            prisma.barbershop.count({ where: { createdAt: { gte: last7 } } }),
            prisma.barbershop.count({ where: { createdAt: { gte: last30 } } }),
            prisma.barbershop.groupBy({ by: ["planStatus"], _count: { _all: true } }),
            prisma.user.count(),
            prisma.appointment.count(),
            prisma.appointment.count({ where: { createdAt: { gte: last30 } } }),
            prisma.platformTransaction.aggregate({
                where: { status: "PAID", paidAt: { gte: last30 } },
                _sum: { amount: true },
                _count: { _all: true },
            }),
            prisma.platformTransaction.aggregate({
                where: { status: "PAID", paidAt: { gte: startOfMonth } },
                _sum: { amount: true },
            }),
            prisma.platformTransaction.aggregate({
                where: { status: "PAID" },
                _sum: { amount: true },
            }),
            prisma.barbershop.findMany({
                where: { createdAt: { gte: last30 } },
                select: { createdAt: true },
            }),
            prisma.platformTransaction.findMany({
                where: { status: "PAID", paidAt: { gte: daysAgo(180) } },
                select: { paidAt: true, amount: true },
            }),
            prisma.affiliate.count({ where: { status: "ACTIVE" } }),
            prisma.affiliate.count(),
            prisma.referralClick.count({ where: { createdAt: { gte: last30 } } }),
            prisma.referral.groupBy({ by: ["status"], _count: { _all: true } }),
            prisma.commission.groupBy({
                by: ["status"],
                _sum: { amount: true },
                _count: { _all: true },
            }),
            // Acessos ao /r/ que não atribuíram ninguém, agrupados pelo código
            // que veio na URL — é assim que um link com typo aparece.
            prisma.referralMiss.groupBy({
                by: ["code", "reason"],
                where: { createdAt: { gte: last30 } },
                _count: { _all: true },
                orderBy: { _count: { code: "desc" } },
                take: 10,
            }),
        ]);

        const planCounts: Record<string, number> = {};
        for (const g of planGroups) planCounts[g.planStatus] = g._count._all;

        // Barbearias em trial que ainda não venceram vs. as que passaram do prazo.
        const [trialActive, trialExpired] = await Promise.all([
            prisma.barbershop.count({
                where: { planStatus: "TRIAL", planExpiresAt: { gte: now } },
            }),
            prisma.barbershop.count({
                where: { planStatus: "TRIAL", planExpiresAt: { lt: now } },
            }),
        ]);

        const paying = (planCounts.PRO ?? 0) + (planCounts.ACTIVE ?? 0);

        // Série de cadastros: um ponto por dia nos últimos 30 dias, inclusive
        // os dias zerados (senão o gráfico mente sobre a cadência).
        const signupBuckets = new Map<string, number>();
        for (let i = 29; i >= 0; i--) {
            const d = daysAgo(i);
            signupBuckets.set(dateKey(d), 0);
        }
        for (const row of signupSeries) {
            const key = dateKey(row.createdAt);
            if (signupBuckets.has(key)) signupBuckets.set(key, (signupBuckets.get(key) ?? 0) + 1);
        }

        const revenueBuckets = new Map<string, number>();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            revenueBuckets.set(competenceOf(d), 0);
        }
        for (const row of revenueSeries) {
            const key = competenceOf(row.paidAt);
            if (revenueBuckets.has(key)) revenueBuckets.set(key, (revenueBuckets.get(key) ?? 0) + row.amount);
        }

        const commissionByStatus: Record<string, { amount: number; count: number }> = {};
        for (const g of commissionGroups) {
            commissionByStatus[g.status] = { amount: g._sum.amount ?? 0, count: g._count._all };
        }

        const referralByStatus: Record<string, number> = {};
        for (const g of referralGroups) referralByStatus[g.status] = g._count._all;

        const totalReferrals = Object.values(referralByStatus).reduce((a, b) => a + b, 0);

        return NextResponse.json({
            barbershops: {
                total: totalBarbershops,
                paying,
                trialActive,
                trialExpired,
                free: planCounts.FREE ?? 0,
                newLast7,
                newLast30,
                // Quantas das barbearias criadas viraram pagantes.
                trialToPaidRate: totalBarbershops > 0 ? paying / totalBarbershops : 0,
            },
            usage: {
                totalUsers,
                totalAppointments,
                appointments30,
            },
            revenue: {
                last30: revenue30._sum.amount ?? 0,
                transactions30: revenue30._count._all,
                currentMonth: revenueMonth._sum.amount ?? 0,
                allTime: revenueAllTime._sum.amount ?? 0,
                // MRR aproximado: pagantes × ticket médio dos últimos 30 dias.
                mrr:
                    revenue30._count._all > 0
                        ? ((revenue30._sum.amount ?? 0) / revenue30._count._all) * paying
                        : 0,
            },
            affiliates: {
                total: totalAffiliates,
                active: activeAffiliates,
                clicks30,
                referrals: totalReferrals,
                referralsActive: referralByStatus.ACTIVE ?? 0,
                referralsTrial: referralByStatus.TRIAL ?? 0,
                referralsChurned: referralByStatus.CHURNED ?? 0,
                // Do clique ao cadastro. Só faz sentido com volume; abaixo de
                // ~100 cliques o número oscila demais pra guiar decisão.
                clickToSignupRate: clicks30 > 0 ? totalReferrals / clicks30 : 0,
                commissionPending: commissionByStatus.PENDING?.amount ?? 0,
                commissionApproved: commissionByStatus.APPROVED?.amount ?? 0,
                commissionPaid: commissionByStatus.PAID?.amount ?? 0,
                // Tráfego que chegou pelo /r/ e não virou indicação de ninguém.
                missedClicks30: missGroups.reduce((sum, m) => sum + m._count._all, 0),
                misses: missGroups.map((m) => ({
                    code: m.code,
                    reason: m.reason,
                    count: m._count._all,
                })),
            },
            series: {
                signups: [...signupBuckets].map(([date, count]) => ({ date, count })),
                revenue: [...revenueBuckets].map(([month, amount]) => ({ month, amount })),
            },
        });
    } catch (error) {
        console.error("Erro ao montar métricas do console:", error);
        return NextResponse.json({ error: "Erro ao carregar métricas" }, { status: 500 });
    }
}
