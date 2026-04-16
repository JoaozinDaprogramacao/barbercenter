import prisma from "@/lib/prisma";

export async function checkSubscription(barbershopId: string) {
  const barbershop = await prisma.barbershop.findUnique({
    where: { id: barbershopId },
    select: { planStatus: true, trialExpiresAt: true }
  });

  if (!barbershop) return false;

  // Se o plano está ativo (pagamento confirmado), liberado
  if (barbershop.planStatus === "ACTIVE") return true;

  // Se está em TRIAL, verifica se ainda não expirou
  if (barbershop.planStatus === "TRIAL") {
    const isTrialValid = new Date() <= new Date(barbershop.trialExpiresAt);
    return isTrialValid;
  }

  return false;
}