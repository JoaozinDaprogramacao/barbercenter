import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!rawBody) return NextResponse.json({ error: "Corpo vazio" }, { status: 400 });
    
    const body = JSON.parse(rawBody);
    const { userId, name, email, taxId, cellphone } = body;

    if (!userId) return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 });

    // 🔥 MUDANÇA 1: Incluir a barbearia na busca do usuário
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { barbershop: true } 
    });

    if (!user || !user.barbershop) {
        return NextResponse.json({ error: "Usuário ou Barbearia não encontrado" }, { status: 404 });
    }

    // 🔥 MUDANÇA 2: Pegar o customerId da barbearia
    let customerId = user.barbershop.abacateCustomerId;

    if (!customerId) {
      const customerRes = await fetch('https://api.abacatepay.com/v2/customers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`
        },
        body: JSON.stringify({ name, email, taxId, cellphone, zipCode: "00000000" })
      });

      if (!customerRes.ok) {
        const errorData = await customerRes.text();
        return NextResponse.json({ error: "Erro ao criar cliente", detalhes: errorData }, { status: customerRes.status });
      }

      const customerData = await customerRes.json();
      customerId = customerData.data.id;

      // 🔥 MUDANÇA 3: Atualizar a tabela Barbershop, e não User
      await prisma.barbershop.update({
        where: { id: user.barbershopId },
        data: { abacateCustomerId: customerId }
      });
    }

    const pixRes = await fetch('https://api.abacatepay.com/v2/transparents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`
      },
      body: JSON.stringify({
        method: "PIX",
        data: {
          amount: 3290,
          description: "Assinatura Pro InBarber",
          customer: { name, email, taxId, cellphone },
          metadata: { userId, barbershopId: user.barbershopId }
        }
      })
    });

    if (!pixRes.ok) {
      const pixError = await pixRes.text();
      return NextResponse.json({ error: "Erro ao gerar PIX", detalhes: pixError }, { status: pixRes.status });
    }

    const abacateData = await pixRes.json();

    return NextResponse.json({
      qr_code_base64: abacateData.data.brCodeBase64,
      pix_code: abacateData.data.brCode,
      payment_id: abacateData.data.id
    });

  } catch (error: any) {
    console.error("Erro interno:", error);
    return NextResponse.json({ error: 'Erro interno no servidor', detalhes: error.message }, { status: 500 });
  }
}