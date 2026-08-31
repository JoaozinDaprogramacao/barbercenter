import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clientIp } from "@/lib/platform/auth";
import { rateLimit } from "@/lib/platform/rate-limit";
import { REFERRAL_COOKIE } from "@/lib/platform/constants";
import { isFunnelStep, VISITOR_COOKIE, VISITOR_COOKIE_MAX_AGE } from "@/lib/platform/funnel";
import { newVisitorId, track } from "@/lib/platform/track";

export const dynamic = "force-dynamic";

// Endpoint público e sem autenticação. As três travas que importam:
//  1. allowlist de etapas — nome fora da lista é rejeitado
//  2. rate limit por IP — impede alguém encher a tabela
//  3. metadata limitada, sem dado pessoal
const MAX_EVENTS_PER_MINUTE = 60;

export async function POST(req: Request) {
    try {
        const ip = clientIp(req) ?? "unknown";
        if (!rateLimit(`track:${ip}`, MAX_EVENTS_PER_MINUTE, 60_000).allowed) {
            return NextResponse.json({ ok: false }, { status: 429 });
        }

        const body = await req.json().catch(() => null);
        if (!body || !isFunnelStep(body.step)) {
            // 204 mesmo em payload inválido: é telemetria, o front não deve
            // mudar de comportamento por causa disso.
            return new NextResponse(null, { status: 204 });
        }

        const store = await cookies();

        // O id do visitante NUNCA vem do corpo — só do cookie httpOnly. Se
        // viesse do cliente, qualquer um forjaria o funil de outra pessoa.
        let visitorId = store.get(VISITOR_COOKIE)?.value;
        let isNewVisitor = false;

        if (!visitorId || !/^[0-9a-f-]{36}$/i.test(visitorId)) {
            visitorId = newVisitorId();
            isNewVisitor = true;
        }

        const referralCode = store.get(REFERRAL_COOKIE)?.value ?? null;
        const url = new URL(req.url);

        await track(
            {
                visitorId,
                userAgent: req.headers.get("user-agent"),
                referer: req.headers.get("referer"),
                host: url.host,
                path: typeof body.path === "string" ? body.path.slice(0, 200) : null,
            },
            body.step,
            {
                key: typeof body.key === "string" ? body.key : undefined,
                metadata: typeof body.metadata === "object" && body.metadata !== null
                    ? body.metadata
                    : undefined,
                referralCode,
            }
        );

        const response = new NextResponse(null, { status: 204 });

        if (isNewVisitor) {
            response.cookies.set(VISITOR_COOKIE, visitorId, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: VISITOR_COOKIE_MAX_AGE,
                path: "/",
            });
        }

        return response;
    } catch (error) {
        console.error("Erro ao registrar evento:", error);
        return new NextResponse(null, { status: 204 });
    }
}
