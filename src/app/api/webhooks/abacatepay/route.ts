import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, data } = body;

    const metadata = data.metadata || data.transparent?.metadata || data.subscription?.metadata;
    const userId = metadata?.userId;
    let barbershopId = metadata?.barbershopId;

    if (!userId && !barbershopId) {
      console.warn("⚠️ Webhook recebido, mas não conseguimos encontrar o metadata.");
      console.log("Estrutura recebida:", JSON.stringify(data, null, 2));
      return NextResponse.json({ ok: true });
    }

    // Fallback de segurança: Caso algum PIX antigo tenha sido gerado só com userId
    if (!barbershopId && userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        barbershopId = user.barbershopId;
      } else {
        console.warn(`⚠️ Usuário ${userId} não encontrado para vincular a barbearia.`);
        return NextResponse.json({ ok: true });
      }
    }

    switch (event) {
      case 'transparent.completed': 
      case 'subscription.completed': 
      case 'subscription.renewed':   
        // 🔥 MUDANÇA: Agora atualiza a Barbershop!
        await prisma.barbershop.update({
          where: { id: barbershopId },
          data: {
            planStatus: 'PRO',
            planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        console.log(`✅ Acesso PRO liberado para a barbearia: ${barbershopId}`);
        break;

      case 'subscription.cancelled':
      case 'subscription.refunded':
      case 'transparent.refunded':
        // 🔥 MUDANÇA: Agora atualiza a Barbershop!
        await prisma.barbershop.update({
          where: { id: barbershopId },
          data: {
            planStatus: 'FREE', // Ou 'TRIAL_EXPIRED', dependendo de como você chama
          },
        });
        console.log(`❌ Acesso PRO removido para a barbearia: ${barbershopId}`);
        break;

      default:
        console.log(`ℹ️ Evento ignorado: ${event}`);
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("❌ Erro no processamento do Webhook:", err.message);
    return NextResponse.json({ error: "Payload inválido", detalhes: err.message }, { status: 400 });
  }
}