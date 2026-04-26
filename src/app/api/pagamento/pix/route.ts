import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // ⚠️ Ajuste o caminho se seu arquivo prisma estiver em outro lugar (ex: '@/src/generated/client')

export async function POST(request: Request) {
  try {
    // 1. Recebemos os dados do frontend (que agora deve enviar o ID da barbearia)
    const body = await request.json();
    const { barbershopId, name, email, taxId, cellphone } = body;

    if (!barbershopId) {
      return NextResponse.json({ error: "O ID da barbearia é obrigatório" }, { status: 400 });
    }

    // 2. Buscamos a barbearia no seu banco de dados
    const barbershop = await prisma.barbershop.findUnique({
      where: { id: barbershopId }
    });

    if (!barbershop) {
      return NextResponse.json({ error: "Barbearia não encontrada" }, { status: 404 });
    }

    let customerId = barbershop.abacateCustomerId;

    // 3. Se a barbearia ainda não tem um ID no AbacatePay, criamos um agora!
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
          zipCode: "00000000" // Genérico apenas para passar na validação, se exigido
        })
      });

      const customerData = await customerResponse.json();
      if (!customerResponse.ok) {
        throw new Error(customerData.error || "Erro ao criar cliente no AbacatePay");
      }

      customerId = customerData.data.id;

      // 💾 SALVA NO BANCO: Atualiza a barbearia para nunca mais precisar criar esse cliente
      await prisma.barbershop.update({
        where: { id: barbershopId },
        data: { abacateCustomerId: customerId }
      });
    }

    // 4. Com o customerId em mãos (novo ou antigo), geramos o PIX
    const response = await fetch('https://api.abacatepay.com/v2/transparents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`
      },
      body: JSON.stringify({
        method: "PIX",
        data: {
          amount: 3290, // R$ 32,90
          description: "Assinatura Pro InBarber",
          expiresIn: 3600,
          // Agora usamos o ID salvo no banco em vez de passar os dados soltos
          customerId: customerId, 
          metadata: {
            // 🔥 ISSO É CRUCIAL: O webhook vai ler isso para saber quem pagou!
            barbershopId: barbershopId 
          }
        }
      })
    });

    const abacateData = await response.json();

    if (!response.ok) {
      console.log("LOG DE ERRO DETALHADO:", JSON.stringify(abacateData, null, 2));
      return NextResponse.json(
        { error: abacateData.error || "Erro na API" },
        { status: response.status }
      );
    }

    // 5. Estrutura correta de retorno para a sua tela do Framer Motion exibir o QR Code
    return NextResponse.json({
      qr_code_base64: abacateData.data.brCodeBase64,
      pix_code: abacateData.data.brCode,
      payment_id: abacateData.data.id
    });
    
  } catch (error: any) {
    console.error("ERRO NO TERMINAL:", error.message);
    return NextResponse.json(
      { error: 'Erro interno ao gerar Pix', detalhes: error.message }, 
      { status: 500 }
    );
  }
}