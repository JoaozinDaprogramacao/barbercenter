import { createHash } from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { PlatformRole } from "./constants";

export type PlatformActor = {
    id: string;
    name: string;
    email: string;
    role: PlatformRole;
};

/**
 * Porta de entrada de TODA rota /api/console.
 *
 * O proxy já barra o acesso a /console, mas proxy é conveniência de UX, não
 * fronteira de segurança — um request direto na API não passa por ele, e o
 * histórico do Next tem CVEs de bypass de middleware. Então aqui a checagem é
 * refeita do zero e, principalmente, relendo o banco: se o admin foi desativado
 * há cinco minutos, o JWT dele ainda é válido, mas `isActive` já não é.
 */
export async function getPlatformActor(): Promise<PlatformActor | null> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.scope !== "PLATFORM") return null;

    const admin = await prisma.platformUser.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (!admin || !admin.isActive) return null;

    return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role as PlatformRole,
    };
}

/**
 * Versão para route handlers: devolve o ator ou a resposta de erro pronta.
 * Uso: `const gate = await requirePlatformActor(); if (gate.error) return gate.error;`
 */
export async function requirePlatformActor(minimumRole?: PlatformRole) {
    const actor = await getPlatformActor();

    if (!actor) {
        return { actor: null, error: NextResponse.json({ error: "Não autorizado" }, { status: 401 }) };
    }

    // ANALYST lê, SUPERADMIN escreve. Rotas de mutação pedem SUPERADMIN.
    if (minimumRole === "SUPERADMIN" && actor.role !== "SUPERADMIN") {
        return { actor: null, error: NextResponse.json({ error: "Permissão insuficiente" }, { status: 403 }) };
    }

    return { actor, error: null as null };
}

export function clientIp(req: Request): string | null {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return req.headers.get("x-real-ip");
}

/** Nunca guardamos IP cru de visitante. O sal vem do NEXTAUTH_SECRET. */
export function hashIp(ip: string | null): string | null {
    if (!ip) return null;
    return createHash("sha256")
        .update(`${process.env.NEXTAUTH_SECRET ?? ""}:${ip}`)
        .digest("hex")
        .slice(0, 32);
}

type AuditInput = {
    actor: PlatformActor | { id: string | null; email: string };
    action: string;
    targetType?: string;
    targetId?: string;
    metadata?: Record<string, unknown>;
    req?: Request;
};

/**
 * Toda mutação do painel passa por aqui. Falha de auditoria não derruba a
 * operação (o log é secundário), mas é gritada no console do servidor.
 */
export async function audit({ actor, action, targetType, targetId, metadata, req }: AuditInput) {
    try {
        await prisma.adminAuditLog.create({
            data: {
                platformUserId: actor.id,
                actorEmail: actor.email,
                action,
                targetType,
                targetId,
                metadata: metadata as never,
                ip: req ? clientIp(req) : null,
                userAgent: req?.headers.get("user-agent") ?? null,
            },
        });
    } catch (error) {
        console.error(`⚠️ Falha ao gravar auditoria (${action}):`, error);
    }
}
