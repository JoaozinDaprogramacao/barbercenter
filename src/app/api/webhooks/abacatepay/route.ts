import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // ⚠️ Ajuste o caminho do seu prisma se necessário

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = body.event; // Ex: "billing.paid", "billing.overdue"
    const data = body.data;   // Os dados da cobrança

    // Validação básica de segurança
    if (!data || !data.customerId) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const customerId = data.customerId;
    const barbershopIdFromMeta = data.metadata?.barbershopId;

    // 1. O João pagou! (PIX único ou primeira/nova parcela do Cartão)
    if (event === 'billing.paid') {
      
      // Encontra a barbearia pelo metadata (mais seguro) ou pelo ID do AbacatePay
      let barbershop = null;
      
      if (barbershopIdFromMeta) {
        barbershop = await prisma.barbershop.findUnique({ where: { id: barbershopIdFromMeta } });
      } 
      
      if (!barbershop) {
        barbershop = await prisma.barbershop.findFirst({ where: { abacateCustomerId: customerId } });
      }

      if (barbershop) {
        // Calcula a nova data de expiração: Hoje + 30 dias
        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + 30);

        // Atualiza no banco de dados com os nomes corretos das colunas
        await prisma.barbershop.update({
          where: { id: barbershop.id },
          data: { 
            planStatus: 'ACTIVE',
            planExpiresAt: newExpiry
          }
        });

        console.log(`✅ Acesso liberado! 30 dias adicionados para a barbearia ID: ${barbershop.id}`);
      } else {
        console.log(`❌ Barbearia não encontrada para o cliente: ${customerId}`);
      }
    }

    // 2. Pagamento atrasou ou assinatura suspensa
    if (event === 'billing.overdue' || event === 'subscription.suspended') {
      
      // Busca a barbearia para atualizar o status
      const barbershop = await prisma.barbershop.findFirst({ 
        where: { abacateCustomerId: customerId } 
      });

      if (barbershop) {
        // Marcamos como PAST_DUE, mas a data de expiração NÃO MUDA. 
        // Sua função de carência de 7 dias (feita anteriormente) cuidará do bloqueio real
        await prisma.barbershop.update({
          where: { id: barbershop.id },
          data: { planStatus: 'PAST_DUE' }
        });
        
        console.log(`⚠️ Status alterado para PAST_DUE para a barbearia ID: ${barbershop.id}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("ERRO NO WEBHOOK:", error.message);
    return NextResponse.json({ error: 'Webhook Error', detalhes: error.message }, { status: 500 });
  }
}