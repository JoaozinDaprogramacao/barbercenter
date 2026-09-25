// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { rateLimit, resetRateLimit } from "@/lib/platform/rate-limit";

// Tentativas erradas seguidas antes de trancar o admin da plataforma.
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;

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
          scope: "TENANT",
          barbershopId: user.barbershopId,
          planStatus: user.barbershop.planStatus,
          planExpiresAt: user.barbershop.planExpiresAt,
        };
      }
    }),

    // 🔒 Login do painel da plataforma (/console). Tabela separada de `users`:
    // um dono de barbearia não tem identidade aqui, então não há como escalar
    // de tenant para plataforma por bug de update em /api/settings/team.
    CredentialsProvider({
      id: "platform",
      name: "Platform Console",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Mensagem única em todos os caminhos de falha: sem enumeração de e-mail,
        // sem distinguir "não existe" de "senha errada" de "trancado".
        const generic = new Error("Credenciais inválidas");

        if (!credentials?.email || !credentials?.password) throw generic;

        const email = credentials.email.trim().toLowerCase();
        const ip =
          (req?.headers?.["x-forwarded-for"] as string | undefined)?.split(",")[0].trim() ??
          (req?.headers?.["x-real-ip"] as string | undefined) ??
          "unknown";

        // Duas janelas: por IP (bloqueia varredura) e por e-mail (bloqueia
        // ataque distribuído contra uma conta específica).
        if (!rateLimit(`console:ip:${ip}`, 10, 60_000).allowed) throw generic;
        if (!rateLimit(`console:email:${email}`, 5, 60_000).allowed) throw generic;

        const admin = await prisma.platformUser.findUnique({ where: { email } });
        if (!admin || !admin.isActive) throw generic;

        if (admin.lockedUntil && admin.lockedUntil > new Date()) throw generic;

        const isValid = await compare(credentials.password, admin.password);

        if (!isValid) {
          const attempts = admin.failedLoginAttempts + 1;
          await prisma.platformUser.update({
            where: { id: admin.id },
            data: {
              failedLoginAttempts: attempts,
              lockedUntil:
                attempts >= MAX_FAILED_LOGINS
                  ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000)
                  : null,
            },
          });

          await prisma.adminAuditLog.create({
            data: {
              actorEmail: email,
              action: "CONSOLE_LOGIN_FAILED",
              metadata: { attempts } as never,
              ip: ip === "unknown" ? null : ip,
              userAgent: (req?.headers?.["user-agent"] as string | undefined) ?? null,
            },
          }).catch(() => { });

          throw generic;
        }

        await prisma.platformUser.update({
          where: { id: admin.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
            lastLoginIp: ip === "unknown" ? null : ip,
          },
        });

        resetRateLimit(`console:email:${email}`);

        await prisma.adminAuditLog.create({
          data: {
            platformUserId: admin.id,
            actorEmail: admin.email,
            action: "CONSOLE_LOGIN_SUCCESS",
            ip: ip === "unknown" ? null : ip,
            userAgent: (req?.headers?.["user-agent"] as string | undefined) ?? null,
          },
        }).catch(() => { });

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          scope: "PLATFORM",
          // Sem barbershopId de propósito: um token da plataforma não pode ser
          // reaproveitado nas rotas de tenant, que exigem esse campo.
          barbershopId: "",
          planStatus: "",
          planExpiresAt: "",
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
        token.scope = ((user as any).scope as "TENANT" | "PLATFORM") ?? "TENANT";
        token.barbershopId = user.barbershopId;
        token.planStatus = (user as any).planStatus;
        token.planExpiresAt = (user as any).planExpiresAt;
      }

      // 🔥 A MÁGICA AQUI: Quando o frontend pedir para atualizar
      // (só faz sentido para tenant: plano é coisa de barbearia)
      if (trigger === "update" && token.scope !== "PLATFORM") {
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
        session.user.scope = (token.scope as "TENANT" | "PLATFORM") ?? "TENANT";
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
