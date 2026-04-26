import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = body.event; 
    const data = body.data;

    // Validação de segurança básica do payload
    if (!data || !data.customerId) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const customerId = data.customerId;
    const barbershopIdFromMeta = data.metadata?.barbershopId;

    // Lista de eventos que confirmam entrada de dinheiro (PIX ou Cartão)
    const successEvents = [
      'transparent.completed',
      'subscription.completed',
      'subscription.renewed',
      'checkout.completed'
    ];

    // 1. PROCESSAR SUCESSO (LIBERAR ACESSO)
    if (successEvents.includes(event)) {
      let barbershop = null;

      // Tenta localizar a barbearia prioritariamente pelo ID enviado no metadata
      if (barbershopIdFromMeta) {
        barbershop = await prisma.barbershop.findUnique({ 
          where: { id: barbershopIdFromMeta } 
        });
      }

      // Fallback: se não achar pelo meta, tenta pelo ID do cliente no AbacatePay
      if (!barbershop) {
        barbershop = await prisma.barbershop.findFirst({ 
          where: { abacateCustomerId: customerId } 
        });
      }

      if (barbershop) {
        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + 30);

        await prisma.barbershop.update({
          where: { id: barbershop.id },
          data: { 
            planStatus: 'ACTIVE',
            planExpiresAt: newExpiry
          }
        });

        console.log(`✅ ACESSO LIBERADO: +30 dias para a barbearia [${barbershop.name || barbershop.id}] via evento ${event}`);
      } else {
        console.log(`❌ ERRO: Evento ${event} recebido, mas nenhuma barbearia foi encontrada para o Customer ${customerId}`);
      }
    }

    // 2. PROCESSAR CANCELAMENTO
    if (event === 'subscription.cancelled') {
      await prisma.barbershop.updateMany({
        where: { abacateCustomerId: customerId },
        data: { planStatus: 'CANCELED' }
      });
      console.log(`🚫 ASSINATURA CANCELADA: Customer ${customerId}`);
    }

    // 3. PROCESSAR FALHAS OU ATRASOS (OPCIONAL - DEPENDE DOS EVENTOS DISPONÍVEIS)
    const failureEvents = ['checkout.lost', 'transparent.lost'];
    if (failureEvents.includes(event)) {
      await prisma.barbershop.updateMany({
        where: { abacateCustomerId: customerId },
        data: { planStatus: 'PAST_DUE' }
      });
      console.log(`⚠️ PAGAMENTO PERDIDO/ATRASADO: Customer ${customerId}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("❌ ERRO CRÍTICO WEBHOOK:", error.message);
    return NextResponse.json(
      { error: 'Webhook Error', details: error.message }, 
      { status: 500 }
    );
  }
}