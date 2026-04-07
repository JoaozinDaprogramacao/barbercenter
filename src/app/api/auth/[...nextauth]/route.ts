import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-mail e senha são obrigatórios");
        }

        // 1. Busca o usuário no banco
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("Usuário não encontrado");
        }

        // 2. Compara a senha digitada com o Hash do banco
        const isValidPassword = await compare(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error("Senha incorreta");
        }

        // 3. Retorna os dados que vão ficar na sessão (O PULO DO GATO ESTÁ AQUI)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          barbershopId: user.barbershopId, // Essencial para o SaaS
        };
      }
    })
  ],
  callbacks: {
    // Transfere os dados do usuário para o Token (Crachá virtual)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.barbershopId = user.barbershopId;
      }
      return token;
    },
    // Transfere os dados do Token para a Sessão (O que o seu frontend consegue ler)
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.barbershopId = token.barbershopId as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/', // Diz pro NextAuth que sua página de login customizada é a home
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };