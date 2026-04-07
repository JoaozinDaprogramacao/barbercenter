// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// 1. Estende a tipagem da Sessão e do Usuário
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      barbershopId: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    barbershopId: string;
  }
}

// 2. Estende a tipagem do Token (JWT)
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    barbershopId: string;
  }
}