import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

// 1. Isolamos as opções e EXPORTAMOS elas
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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) throw new Error("Usuário não encontrado");

        const isValidPassword = await compare(credentials.password, user.password);

        if (!isValidPassword) throw new Error("Senha incorreta");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          barbershopId: user.barbershopId,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.barbershopId = user.barbershopId;
      }
      return token;
    },
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
    signIn: '/', 
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// 2. Passamos as opções para o NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };