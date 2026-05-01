import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, data } = body;

    // Ajuste aqui: O metadata pode vir em lugares diferentes dependendo do evento
    // No V2, ele vem dentro de 'transparent' ou 'subscription'
    const metadata = data.metadata || data.transparent?.metadata || data.subscription?.metadata;
    const userId = metadata?.userId;

    if (!userId) {
      console.warn("⚠️ Webhook recebido, mas não conseguimos encontrar o userId no metadata.");
      console.log("Estrutura recebida:", JSON.stringify(data, null, 2));
      // Retornamos 200 para o AbacatePay não ficar tentando reenviar um payload que não tem nosso ID
      return NextResponse.json({ ok: true });
    }

    switch (event) {
      case 'transparent.completed': // Pix aprovado
      case 'subscription.completed': // Assinatura nova aprovada
      case 'subscription.renewed':   // Renovação mensal aprovada
        await prisma.user.update({
          where: { id: userId },
          data: {
            planStatus: 'PRO',
            planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        console.log(`✅ Acesso PRO liberado para o usuário: ${userId}`);
        break;

      case 'subscription.cancelled':
      case 'subscription.refunded':
      case 'transparent.refunded':
        await prisma.user.update({
          where: { id: userId },
          data: {
            planStatus: 'FREE',
          },
        });
        console.log(`❌ Acesso PRO removido para o usuário: ${userId}`);
        break;

      default:
        console.log(`ℹ️ Evento ignorado: ${event}`);
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("❌ Erro no processamento do Webhook:", err.message);
    // Se o JSON vier malformado, retornamos erro para debug
    return NextResponse.json({ error: "Payload inválido", detalhes: err.message }, { status: 400 });
  }
}