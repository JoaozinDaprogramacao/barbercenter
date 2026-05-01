import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const { pathname } = req.nextUrl;

  // 1. Se o usuário está logado e tenta acessar /login ou a home, manda para /admin
  if (pathname === "/login" || pathname === "/") {
    if (isAuth) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // 2. Proteção das rotas de Admin e Verificação de Assinatura
  if (pathname.startsWith("/admin")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 🔥 O CÃO DE GUARDA DO PAGAMENTO 🔥
    if (token.planExpiresAt) {
      const expirationDate = new Date(token.planExpiresAt as string | Date);
      const now = new Date();

      // Se a data de hoje for maior que a data de expiração
      if (now > expirationDate) {
        return NextResponse.redirect(new URL("/bloqueado", req.url));
      }
    }
  }

  // 3. Proteção da rota /bloqueado
  if (pathname === "/bloqueado") {
    // Se não estiver logado, não tem por que ver essa tela
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Se o usuário já pagou (não está expirado) e tentar acessar /bloqueado de "curioso", volta pro admin
    if (token.planExpiresAt) {
      const expirationDate = new Date(token.planExpiresAt as string | Date);
      if (new Date() <= expirationDate) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }
  }

  return NextResponse.next();
}

// O MATCHER É A CHAVE
export const config = {
  matcher: [
    "/admin/:path*",
    "/login", 
    "/",
    "/bloqueado" // <-- IMPORTANTE: O middleware precisa vigiar essa rota também
  ],
};