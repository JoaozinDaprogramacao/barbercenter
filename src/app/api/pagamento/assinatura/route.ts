import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, email, taxId, cellphone } = body;

    if (!userId) return NextResponse.json({ error: "O ID do usuário é obrigatório" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    let customerId = user.abacateCustomerId;

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

      await prisma.user.update({
        where: { id: userId },
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
        items: [{ id: "prod_f1p0jFTuxDXpzftezmxwZjwR", quantity: 1 }],
        customerId: customerId,
        externalId: `subs-${userId}-${Date.now()}`,
        completionUrl: `${process.env.NEXTAUTH_URL}/admin/settings`,
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