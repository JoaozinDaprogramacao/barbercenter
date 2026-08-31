import prisma from "@/lib/prisma";
import { PLAN_ACTIVE_STATUSES } from "@/lib/platform/constants";

export async function checkSubscription(barbershopId: string) {
  const barbershop = await prisma.barbershop.findUnique({
    where: { id: barbershopId },
    select: { planStatus: true, planExpiresAt: true }
  });

  if (!barbershop) return false;

  // O webhook grava "PRO"; "ACTIVE" fica aceito por compatibilidade com
  // registros antigos. Antes só "ACTIVE" era testado, então esta checagem
  // nunca liberava ninguém que tivesse pago.
  if ((PLAN_ACTIVE_STATUSES as readonly string[]).includes(barbershop.planStatus)) {
    return new Date() <= new Date(barbershop.planExpiresAt);
  }

  // Se está em TRIAL, verifica se ainda não expirou
  if (barbershop.planStatus === "TRIAL") {
    const isTrialValid = new Date() <= new Date(barbershop.planExpiresAt);
    return isTrialValid;
  }

  return false;
}
