import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const { pathname } = req.nextUrl;

  // 1. Redirecionamento de Auth (Login/Home)
  if (pathname === "/login" || pathname === "/") {
    if (isAuth) return NextResponse.redirect(new URL("/admin", req.url));
  }

  // 2. Proteção do Admin
  if (pathname.startsWith("/admin")) {
    if (!isAuth) return NextResponse.redirect(new URL("/login", req.url));

    // Pegamos as duas datas possíveis do token
    const planExpiresAt = token.planExpiresAt;
    const trialExpiresAt = token.trialExpiresAt;

    // A data de expiração real é a que estiver preenchida (prioridade para o plano pago)
    const expirationDate = planExpiresAt ? new Date(planExpiresAt as any) :
      trialExpiresAt ? new Date(trialExpiresAt as any) : null;

    if (expirationDate) {
      const now = new Date();
      if (now > expirationDate) {
        // 🚨 EXPIRADO! Chuta para a tela de bloqueio
        return NextResponse.redirect(new URL("/bloqueado", req.url));
      }
    }
  }

  // 3. Proteção da rota /bloqueado (Evita que quem pagou fique preso lá)
  if (pathname === "/bloqueado" && isAuth) {
    const planExpiresAt = token.planExpiresAt;
    const trialExpiresAt = token.trialExpiresAt;
    const expirationDate = planExpiresAt ? new Date(planExpiresAt as any) :
      trialExpiresAt ? new Date(trialExpiresAt as any) : null;

    if (expirationDate && new Date() <= expirationDate) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/",
    "/bloqueado" // <-- IMPORTANTE: O middleware precisa vigiar essa rota também
  ],
};