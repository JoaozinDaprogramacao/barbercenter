import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requirePlatformActor } from "@/lib/platform/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const gate = await requirePlatformActor();
    if (gate.error) return gate.error;

    try {
        const url = new URL(req.url);
        const search = url.searchParams.get("q")?.trim();
        const plan = url.searchParams.get("plan");
        const take = Math.min(Number(url.searchParams.get("take") ?? 50), 200);
        const skip = Math.max(Number(url.searchParams.get("skip") ?? 0), 0);

        const now = new Date();

        // "expired" não é um planStatus, é uma condição de data — por isso o
        // filtro é montado à mão em vez de virar um where direto.
        const where = {
            ...(search
                ? {
                    OR: [
                        { name: { contains: search } },
                        { phone: { contains: search } },
                        { users: { some: { email: { contains: search } } } },
                    ],
                }
                : {}),
            ...(plan === "expired"
                ? { planExpiresAt: { lt: now } }
                : plan === "paying"
                    ? { planStatus: { in: ["PRO", "ACTIVE"] } }
                    : plan === "trial"
                        ? { planStatus: "TRIAL", planExpiresAt: { gte: now } }
                        : plan
                            ? { planStatus: plan }
                            : {}),
        };

        const [barbershops, total] = await Promise.all([
            prisma.barbershop.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take,
                skip,
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    planStatus: true,
                    planExpiresAt: true,
                    createdAt: true,
                    _count: { select: { users: true, appointments: true, clients: true } },
                    users: {
                        where: { role: "OWNER" },
                        select: { name: true, email: true },
                        take: 1,
                    },
                    referral: {
                        select: {
                            status: true,
                            affiliate: { select: { id: true, name: true, code: true } },
                        },
                    },
                },
            }),
            prisma.barbershop.count({ where }),
        ]);

        return NextResponse.json({
            total,
            barbershops: barbershops.map((b) => ({
                id: b.id,
                name: b.name,
                phone: b.phone,
                planStatus: b.planStatus,
                planExpiresAt: b.planExpiresAt,
                isExpired: b.planExpiresAt < now,
                createdAt: b.createdAt,
                owner: b.users[0] ?? null,
                users: b._count.users,
                appointments: b._count.appointments,
                clients: b._count.clients,
                affiliate: b.referral?.affiliate ?? null,
                referralStatus: b.referral?.status ?? null,
            })),
        });
    } catch (error) {
        console.error("Erro ao listar barbearias:", error);
        return NextResponse.json({ error: "Erro ao listar barbearias" }, { status: 500 });
    }
}
