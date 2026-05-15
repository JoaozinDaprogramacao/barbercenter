import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // A Kiwify envia os dados do cliente no objeto Customer e o status da ordem
    const email = body?.Customer?.email;
    const orderStatus = body?.order_status;
    const subscriptionStatus = body?.Subscription?.status; // Caso seja cancelamento de assinatura

    if (!email) {
      console.warn("⚠️ Webhook Kiwify recebido, mas sem e-mail do cliente.");
      return NextResponse.json({ ok: true });
    }

    // Busca o usuário no banco pelo e-mail usado na Kiwify
    const user = await prisma.user.findUnique({ 
      where: { email: email } 
    });

    if (!user || !user.barbershopId) {
      console.warn(`⚠️ Usuário com e-mail ${email} não encontrado ou sem barbearia vinculada.`);
      return NextResponse.json({ ok: true });
    }

    const barbershopId = user.barbershopId;

    // Cenário 1: Pagamento Aprovado (Primeira compra ou Renovação Mensal)
    if (orderStatus === 'approved') {
      await prisma.barbershop.update({
        where: { id: barbershopId },
        data: {
          planStatus: 'PRO',
          // Adiciona 31 dias a partir da data do pagamento
          planExpiresAt: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000), 
        },
      });
      console.log(`✅ Acesso PRO liberado/renovado para a barbearia: ${barbershopId} (E-mail: ${email})`);
    
    // Cenário 2: Reembolso ou Chargeback
    } else if (orderStatus === 'refunded' || orderStatus === 'chargeback') {
      await prisma.barbershop.update({
        where: { id: barbershopId },
        data: {
          planStatus: 'TRIAL', // ou 'FREE', dependendo da sua regra de negócio
        },
      });
      console.log(`❌ Acesso PRO revogado (Reembolso) para a barbearia: ${barbershopId}`);
    
    // Cenário 3: Assinatura Cancelada 
    // (Opcional: você pode deixar o plano expirar naturalmente pela data em vez de cortar na hora)
    } else if (subscriptionStatus === 'canceled') {
       console.log(`⚠️ Assinatura cancelada para ${email}. O acesso PRO será mantido até a data de expiração (planExpiresAt).`);
       // Aqui não cortamos o planStatus imediatamente, pois ele pagou pelo mês.
       // O sistema naturalmente voltará para FREE quando o `planExpiresAt` for ultrapassado.
    } else {
      console.log(`ℹ️ Evento da Kiwify ignorado: order_status=${orderStatus}`);
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("❌ Erro no processamento do Webhook Kiwify:", err.message);
    return NextResponse.json({ error: "Payload inválido", detalhes: err.message }, { status: 400 });
  }
}