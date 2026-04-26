import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // ⚠️ Ajuste o caminho do prisma se necessário

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 1. Agora também recebemos o barbershopId do frontend
    const { barbershopId, name, email, taxId, cellphone } = body;

    if (!barbershopId) {
      return NextResponse.json({ error: "O ID da barbearia é obrigatório" }, { status: 400 });
    }

    // 2. Buscamos a barbearia no banco de dados
    const barbershop = await prisma.barbershop.findUnique({
      where: { id: barbershopId }
    });

    if (!barbershop) {
      return NextResponse.json({ error: "Barbearia não encontrada" }, { status: 404 });
    }

    let customerId = barbershop.abacateCustomerId;

    // 3. Se a barbearia ainda não tem um ID no AbacatePay, criamos e salvamos no banco
    if (!customerId) {
      const customerResponse = await fetch('https://api.abacatepay.com/v2/customers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`
        },
        body: JSON.stringify({
          name,
          email,
          taxId,
          cellphone,
          zipCode: "00000000"
        })
      });

      const customerData = await customerResponse.json();
      if (!customerResponse.ok) throw new Error(customerData.error || "Erro ao criar cliente");

      customerId = customerData.data.id;

      // 💾 SALVA NO BANCO: Atualiza a barbearia para não duplicar o cliente depois
      await prisma.barbershop.update({
        where: { id: barbershopId },
        data: { abacateCustomerId: customerId }
      });
    }

    // 4. Com o ID (novo ou antigo), criamos a assinatura
    const response = await fetch('https://api.abacatepay.com/v2/subscriptions/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`
      },
      body: JSON.stringify({
        items: [
          { 
            id: "prod_f1p0jFTuxDXpzftezmxwZjwR", // Seu produto do InBarber
            quantity: 1 
          }
        ],
        customerId: customerId, // Usamos o ID que o Prisma nos deu (ou que acabamos de criar)
        externalId: `subs-${barbershopId}-${Date.now()}`, // Incluímos o ID da barbearia pra facilitar o rastreio
        completionUrl: "https://seusite.com/sucesso",
        methods: ["CARD"],
        metadata: {
          barbershopId: barbershopId // Passamos no metadata igual no PIX
        }
      })
    });

    const abacateData = await response.json();

    if (!response.ok) {
      console.log("ERRO AO CRIAR ASSINATURA:", abacateData);
      return NextResponse.json({ error: abacateData.error }, { status: response.status });
    }

    // 5. Retorna os dados para o Front redirecionar para a tela de pagamento
    return NextResponse.json({
      success: true,
      subscriptionId: abacateData.data.id,
      checkoutUrl: abacateData.data.url, 
      customerId: abacateData.data.customerId,
      status: abacateData.data.status
    });

  } catch (error: any) {
    console.error("ERRO NO FLUXO DE ASSINATURA:", error.message);
    return NextResponse.json(
      { error: 'Falha ao processar assinatura', detalhes: error.message },
      { status: 500 }
    );
  }
}