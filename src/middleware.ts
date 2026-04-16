import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const { pathname } = req.nextUrl;

  // IMPORTANTE: Adicione logs para debugar no terminal se o middleware está rodando
  // console.log("Middleware rodando em:", pathname, "| Logado:", isAuth);

  // Se o usuário está logado e tenta acessar /login, manda para /admin
  if (pathname === "/login" || pathname === "/") {
    if (isAuth) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Proteção das rotas de Admin
  if (pathname.startsWith("/admin")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// O MATCHER É A CHAVE: Ele precisa incluir o /login explicitamente
export const config = {
  matcher: [
    "/admin/:path*",
    "/login", 
    "/"
  ],
};