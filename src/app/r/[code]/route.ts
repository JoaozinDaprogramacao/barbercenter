import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { clientIp, hashIp } from "@/lib/platform/auth";
import {
    REFERRAL_COOKIE,
    REFERRAL_COOKIE_MAX_AGE,
    normalizeAffiliateCode,
} from "@/lib/platform/constants";
import { VISITOR_COOKIE, VISITOR_COOKIE_MAX_AGE } from "@/lib/platform/funnel";
import { newVisitorId, track } from "@/lib/platform/track";

// Roda no Node (precisa do Prisma) e nunca em cache: cada acesso é um clique.
export const dynamic = "force-dynamic";

// Destinos permitidos no ?to=. Allowlist fechada — sem isso, /r/CODE?to=https://...
// vira um open redirect assinado pelo nosso domínio, prato cheio pra phishing.
const DESTINATIONS: Record<string, string> = {
    lp: "/",
    registro: "/registro",
};

/**
 * Porta de entrada do link do embaixador: barbercenter.com/r/JOAOBARBER
 *
 * Registra o clique, planta o cookie de atribuição (httpOnly, 90 dias) e
 * manda o visitante pra landing. Código inválido não vaza nada: redireciona
 * pra home igual, só não conta clique nem grava cookie.
 */
export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
    const { code: rawCode } = await params;
    const code = normalizeAffiliateCode(rawCode);

    const url = new URL(req.url);
    const to = url.searchParams.get("to") ?? "lp";
    const destination = DESTINATIONS[to] ?? DESTINATIONS.lp;

    const target = new URL(destination, url.origin);

    const ipHash = hashIp(clientIp(req));
    const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
    const referer = req.headers.get("referer")?.slice(0, 500) ?? null;

    // Um acesso que não atribui ninguém não pode sumir em silêncio: é assim que
    // um link publicado com código errado queima uma campanha inteira sem
    // ninguém perceber. Vira linha em referral_misses e número no painel.
    const registerMiss = async (reason: "NOT_FOUND" | "INACTIVE") => {
        try {
            await prisma.referralMiss.create({
                data: { code: code || rawCode.slice(0, 60), reason, ipHash, userAgent, referer },
            });
        } catch (error) {
            console.error("⚠️ Falha ao registrar clique perdido:", error);
        }
    };

    if (!code) {
        await registerMiss("NOT_FOUND");
        return NextResponse.redirect(target, 302);
    }

    let affiliate: { id: string; status: string } | null = null;

    try {
        affiliate = await prisma.affiliate.findUnique({
            where: { code },
            select: { id: true, status: true },
        });
    } catch (error) {
        console.error("⚠️ Falha ao resolver código de afiliado:", error);
    }

    // Só ACTIVE atribui. PENDING/PAUSED/BANNED cai na landing sem cookie —
    // mas separado de "código não existe", porque a ação é outra: um é typo no
    // link, o outro é embaixador esperando aprovação enquanto já divulga.
    if (!affiliate) {
        await registerMiss("NOT_FOUND");
        return NextResponse.redirect(target, 302);
    }

    if (affiliate.status !== "ACTIVE") {
        await registerMiss("INACTIVE");
        return NextResponse.redirect(target, 302);
    }

    // O clique é métrica, não pode travar o redirect do visitante.
    try {
        await prisma.referralClick.create({
            data: { affiliateId: affiliate.id, ipHash, userAgent, referer, landingPath: destination },
        });
    } catch (error) {
        console.error("⚠️ Falha ao registrar clique de afiliado:", error);
    }

    const response = NextResponse.redirect(target, 302);

    response.cookies.set(REFERRAL_COOKIE, code, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: REFERRAL_COOKIE_MAX_AGE,
        path: "/",
    });

    // 📊 Primeira etapa do funil. O visitante nasce aqui, já atribuído — assim
    // tudo que ele fizer daqui pra frente fica no balde deste embaixador.
    const store = await cookies();
    let visitorId = store.get(VISITOR_COOKIE)?.value;

    if (!visitorId || !/^[0-9a-f-]{36}$/i.test(visitorId)) {
        visitorId = newVisitorId();
        response.cookies.set(VISITOR_COOKIE, visitorId, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: VISITOR_COOKIE_MAX_AGE,
            path: "/",
        });
    }

    await track(
        { visitorId, userAgent, referer, host: url.host, path: destination },
        "LINK_CLICK",
        { key: code, referralCode: code }
    );

    return response;
}
