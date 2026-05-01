import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const { pathname } = req.nextUrl;

  if ((pathname === "/login" || pathname === "/") && isAuth) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuth) return NextResponse.redirect(new URL("/login", req.url));

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
    const planExpiresAt = token.planExpiresAt;
    if (planExpiresAt && new Date() <= new Date(planExpiresAt as string)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/", "/bloqueado"],
};