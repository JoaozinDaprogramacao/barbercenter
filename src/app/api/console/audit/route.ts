import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requirePlatformActor } from "@/lib/platform/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const gate = await requirePlatformActor();
    if (gate.error) return gate.error;

    try {
        const url = new URL(req.url);
        const action = url.searchParams.get("action")?.trim();
        const take = Math.min(Number(url.searchParams.get("take") ?? 100), 500);
        const skip = Math.max(Number(url.searchParams.get("skip") ?? 0), 0);

        const where = action ? { action: { contains: action } } : {};

        const [logs, total] = await Promise.all([
            prisma.adminAuditLog.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take,
                skip,
                include: { platformUser: { select: { name: true } } },
            }),
            prisma.adminAuditLog.count({ where }),
        ]);

        return NextResponse.json({ total, logs });
    } catch (error) {
        console.error("Erro ao listar auditoria:", error);
        return NextResponse.json({ error: "Erro ao listar auditoria" }, { status: 500 });
    }
}
