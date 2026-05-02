// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
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

        // 🔥 MUDANÇA AQUI: include: { barbershop: true }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { barbershop: true }
        });

        if (!user) throw new Error("Usuário não encontrado");

        const isValidPassword = await compare(credentials.password, user.password);
        if (!isValidPassword) throw new Error("Senha incorreta");

        // 🔥 MUDANÇA AQUI: Pegamos o plano de user.barbershop
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          barbershopId: user.barbershopId,
          planStatus: user.barbershop.planStatus,
          planExpiresAt: user.barbershop.planExpiresAt,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Quando o usuário faz o login pela primeira vez
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.barbershopId = user.barbershopId;
        token.planStatus = (user as any).planStatus;
        token.planExpiresAt = (user as any).planExpiresAt;
      }

      // 🔥 A MÁGICA AQUI: Quando o frontend pedir para atualizar
      if (trigger === "update") {
        // Vai no banco buscar os dados fresquinhos que o Webhook acabou de salvar
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { barbershop: true }
        });

        if (freshUser?.barbershop) {
          token.planStatus = freshUser.barbershop.planStatus;
          token.planExpiresAt = freshUser.barbershop.planExpiresAt;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.barbershopId = token.barbershopId as string;
        session.user.planStatus = token.planStatus as string;
        session.user.planExpiresAt = token.planExpiresAt as any;
      }
      return session;
    }
  },
  pages: { signIn: '/' },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };