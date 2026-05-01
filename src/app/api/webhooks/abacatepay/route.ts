import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, data } = body;

    // Recuperamos o userId que enviamos no metadata durante a criação do checkout
    const userId = data.metadata?.userId;

    if (!userId) {
      console.warn("⚠️ Webhook recebido sem userId no metadata.");
      return NextResponse.json({ ok: true });
    }

    switch (event) {
      // EVENTOS DE SUCESSO: Liberam ou renovam o acesso
      case 'transparent.completed': // PIX aprovado
      case 'subscription.completed': // Assinatura nova aprovada
      case 'subscription.renewed':   // Renovação mensal aprovada
        await prisma.user.update({
          where: { id: userId },
          data: {
            planStatus: 'PRO',
            // Define ou estende a expiração para 30 dias a partir de agora
            planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        console.log(`✅ Acesso PRO (re)ativado para o usuário: ${userId}`);
        break;

      // EVENTOS DE PERDA DE ACESSO: Voltam o usuário para o plano FREE
      case 'subscription.cancelled': // Assinatura cancelada manualmente ou por falha
      case 'subscription.refunded':  // Reembolso de assinatura
      case 'transparent.refunded':   // Reembolso de PIX
        await prisma.user.update({
          where: { id: userId },
          data: {
            planStatus: 'FREE',
            // Opcional: Você pode manter a data de expiração antiga ou resetar
          },
        });
        console.log(`❌ Acesso PRO removido para o usuário: ${userId}`);
        break;

      default:
        console.log(`ℹ️ Evento ignorado: ${event}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("❌ Erro crítico no processamento do Webhook:", err.message);
    return NextResponse.json(
      { error: "Erro interno ao processar webhook", detalhes: err.message }, 
      { status: 500 }
    );
  }
}