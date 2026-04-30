import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  console.log("--- INICIANDO DEBUG DE PAGAMENTO ---");

  // 1. Verificar se o corpo da requisição existe
  let body;
  try {
    const rawBody = await request.text();
    console.log("Corpo bruto recebido do front:", rawBody);

    if (!rawBody) {
      throw new Error("O corpo da requisição está completamente vazio.");
    }
    body = JSON.parse(rawBody);
  } catch (err: any) {
    console.error("ERRO NO PASSO 1 (Request Body):", err.message);
    return NextResponse.json({ error: "O frontend não enviou dados", detalhes: err.message }, { status: 400 });
  }

  const { barbershopId, name, email, taxId, cellphone } = body;

  try {
    // 2. Verificar conexão com Banco
    const barbershop = await prisma.barbershop.findUnique({ where: { id: barbershopId } });
    if (!barbershop) return NextResponse.json({ error: "Barbearia não encontrada no banco" }, { status: 404 });

    let customerId = barbershop.abacateCustomerId;

    // 3. Debugar chamada de Cliente
    if (!customerId) {
      console.log("Criando novo cliente na AbacatePay...");
      const customerRes = await fetch('https://api.abacatepay.com/v2/customers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`
        },
        body: JSON.stringify({ name, email, taxId, cellphone, zipCode: "00000000" })
      });

      const customerText = await customerRes.text(); // Lemos como texto primeiro
      console.log("Resposta bruta da criação de cliente:", customerText);

      if (!customerRes.ok) {
        return NextResponse.json({ error: "AbacatePay recusou criação de cliente", detalhes: customerText }, { status: customerRes.status });
      }

      const customerData = JSON.parse(customerText);
      customerId = customerData.data.id;

      await prisma.barbershop.update({
        where: { id: barbershopId },
        data: { abacateCustomerId: customerId }
      });
    }

    // 4. Debugar chamada de PIX
    // 4. Debugar chamada de PIX
    console.log("Gerando PIX para o cliente:", customerId);
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
          // REMOVA O customerId E ADICIONE O OBJETO customer: 👇
          customer: {
            name: name,
            email: email,
            taxId: taxId,
            cellphone: cellphone
          },
          metadata: { barbershopId }
        }
      })
    });

    const pixText = await pixRes.text(); // Lemos como texto primeiro
    console.log("Resposta bruta da geração de PIX:", pixText);

    if (!pixRes.ok) {
      return NextResponse.json({ error: "AbacatePay recusou geração de PIX", detalhes: pixText }, { status: pixRes.status });
    }

    const abacateData = JSON.parse(pixText);

    return NextResponse.json({
      qr_code_base64: abacateData.data.brCodeBase64,
      pix_code: abacateData.data.brCode,
      payment_id: abacateData.data.id
    });

  } catch (error: any) {
    console.error("ERRO CRÍTICO NO TERMINAL:", error);
    return NextResponse.json({ error: 'Erro interno no servidor', detalhes: error.message }, { status: 500 });
  }
}