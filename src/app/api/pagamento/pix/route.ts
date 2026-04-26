import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch('https://api.abacatepay.com/v2/transparents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`
      },
      body: JSON.stringify({
        method: "PIX", // Opcional, mas ajuda na clareza
        data: {
          amount: 3290, // R$ 32,90 (você pode calcular a soma dos produtos antes)
          description: "Assinatura Pro",
          expiresIn: 3600,
          customer: {
            name: "Joao Emanuel",
            email: "joao@teste.com",
            taxId: "10981883656", // Use o CPF que funcionou no Postman
            cellphone: "38999999999"
          },
          metadata: {
            externalId: "assinatura-pro"
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

    // Estrutura correta de retorno da AbacatePay para Transparent
    return NextResponse.json({
      qr_code_base64: abacateData.data.brCodeBase64, // PNG em Base64
      pix_code: abacateData.data.brCode,             // Código Copia e Cola
      payment_id: abacateData.data.id                // ID para simular o pagamento depois
    });
    
  } catch (error: any) {
    console.error("ERRO NO TERMINAL:", error.message);
    return NextResponse.json(
      { error: 'Erro interno ao gerar Pix', detalhes: error.message }, 
      { status: 500 }
    );
  }
}