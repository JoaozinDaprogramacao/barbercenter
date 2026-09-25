import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { REFERRAL_COOKIE, REFERRAL_COOKIE_MAX_AGE } from "@/lib/platform/constants";

// Este proxy é conveniência de UX: redireciona cedo para não renderizar tela
// que o usuário não pode ver. Ele NÃO é a fronteira de segurança — toda rota
// /api/console refaz a checagem no servidor via requirePlatformActor(),
// relendo o banco. Se este arquivo sumisse, a API continuaria trancada.

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isPlatform = token?.scope === "PLATFORM";
  const { pathname, searchParams } = req.nextUrl;

  // ── Atribuição de afiliado via ?ref= nas páginas públicas ──────────────
  // O caminho principal é /r/[code], que registra o clique no banco. Este aqui
  // é o fallback para quando o link foi compartilhado já com querystring.
  const ref = searchParams.get("ref");
  if (ref && !isAuth) {
    const response = NextResponse.next();
    response.cookies.set(REFERRAL_COOKIE, ref.toUpperCase().slice(0, 24), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: REFERRAL_COOKIE_MAX_AGE,
      path: "/",
    });
    return response;
  }

  // ── Painel da plataforma ───────────────────────────────────────────────
  if (pathname.startsWith("/console")) {
    if (pathname === "/console/login") {
      if (isPlatform) return NextResponse.redirect(new URL("/console", req.url));
      return NextResponse.next();
    }

    // Sessão de tenant não vale aqui. Nem logado como dono de barbearia.
    if (!isPlatform) return NextResponse.redirect(new URL("/console/login", req.url));

    const response = NextResponse.next();
    // O painel nunca deve ser indexado, embutido em iframe, nem ficar em cache.
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "no-referrer");
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  }

  if ((pathname === "/login" || pathname === "/") && isAuth) {
    return NextResponse.redirect(new URL(isPlatform ? "/console" : "/admin", req.url));
  }

  // ── Painel da barbearia ────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isAuth) return NextResponse.redirect(new URL("/login", req.url));

    // Token da plataforma não tem barbershopId: não pode passear pelo tenant.
    if (isPlatform) return NextResponse.redirect(new URL("/console", req.url));

    const planExpiresAt = token.planExpiresAt;

    if (planExpiresAt) {
      const expirationDate = new Date(planExpiresAt as string);
      const now = new Date();

      // 🔥 CORTE IMEDIATO: Se a data de agora for maior, bloqueia na hora.
      if (now > expirationDate) {
        return NextResponse.redirect(new URL("/bloqueado", req.url));
      }
    }
  }

  if (pathname === "/bloqueado" && isAuth) {
    if (isPlatform) return NextResponse.redirect(new URL("/console", req.url));

    const planExpiresAt = token.planExpiresAt;
    if (planExpiresAt && new Date() <= new Date(planExpiresAt as string)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/console/:path*", "/login", "/", "/registro", "/bloqueado"],
};
