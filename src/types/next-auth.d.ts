import NextAuth, { DefaultSession } from "next-auth"

// scope separa as duas identidades que convivem no mesmo JWT:
// TENANT   = dono/barbeiro, tem barbershopId, acessa /admin
// PLATFORM = admin da plataforma (tabela platform_users), acessa /console
type SessionScope = "TENANT" | "PLATFORM"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      scope: SessionScope
      barbershopId: string
      planStatus: string
      planExpiresAt: string | Date
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    scope?: SessionScope
    barbershopId: string
    planStatus: string
    planExpiresAt: string | Date
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    scope: SessionScope
    barbershopId: string
    planStatus: string
    planExpiresAt: string | Date
  }
}
