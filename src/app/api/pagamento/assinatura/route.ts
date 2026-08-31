import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { trackForBarbershop } from '@/lib/platform/track';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, taxId, cellphone } = body;

    // O userId sai da sessão, não do body: se viesse do cliente, dava pra
    // criar assinatura em nome de qualquer outra barbearia.
    const session = await getServerSession(authOptions);
    const userId = session?.user?.scope === 'PLATFORM' ? null : session?.user?.id;

    if (!userId) return NextResponse.json({ error: "Sua sessão expirou. Faça login novamente." }, { status: 401 });

    // 🔥 Puxando o ID do produto da variável de ambiente
    const productId = process.env.ABACATEPAY_PRODUCT_ID;
    
    // Trava de segurança: se esquecer de botar no .env em prod, ele avisa
    if (!productId) {
      console.error("❌ ABACATEPAY_PRODUCT_ID não configurado no .env");
      return NextResponse.json({ error: "Erro de configuração do servidor" }, { status: 500 });
    }

    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { barbershop: true }
    });
    
    if (!user || !user.barbershop) {
      return NextResponse.json({ error: "Usuário ou Barbearia não encontrado" }, { status: 404 });
    }

    // 📊 Funil: a pessoa chegou na tela de pagamento e pediu a cobrança.


    await trackForBarbershop(user.barbershopId, 'CHECKOUT_START', { key: 'assinatura' });



    let customerId = user.barbershop.abacateCustomerId;

    if (!customerId) {
      const customerResponse = await fetch('https://api.abacatepay.com/v2/customers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`
        },
        body: JSON.stringify({ name, email, taxId, cellphone, zipCode: "00000000" })
      });

      const customerData = await customerResponse.json();
      if (!customerResponse.ok) throw new Error(customerData.error || "Erro ao criar cliente");

      customerId = customerData.data.id;

      await prisma.barbershop.update({
        where: { id: user.barbershopId },
        data: { abacateCustomerId: customerId }
      });
    }

    const response = await fetch('https://api.abacatepay.com/v2/subscriptions/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`
      },
      body: JSON.stringify({
        // 🔥 Usando a variável de ambiente aqui
        items: [{ id: productId, quantity: 1 }],
        customerId: customerId,
        externalId: `subs-${userId}-${Date.now()}`,
        completionUrl: `${process.env.NEXTAUTH_URL}/sucesso`,
        methods: ["CARD"],
        metadata: { userId, barbershopId: user.barbershopId }
      })
    });

    const abacateData = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: abacateData.error }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      subscriptionId: abacateData.data.id,
      checkoutUrl: abacateData.data.url, 
      customerId: abacateData.data.customerId,
      status: abacateData.data.status
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Falha ao processar assinatura', detalhes: error.message }, { status: 500 });
  }
}