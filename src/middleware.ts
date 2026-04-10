import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login", // Nome da sua página de login
    },
});

export const config = {
    matcher: [
        "/admin/:path*",      // Bloqueia TUDO dentro de /admin
        "/api/admin/:path*",  // Bloqueia APIs administrativas
        // Adicione outras rotas privadas aqui
    ],
};