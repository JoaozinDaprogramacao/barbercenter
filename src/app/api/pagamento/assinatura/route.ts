import { NextResponse } from 'next/server';

// Função auxiliar para criar o cliente na V2
async function createAbacateCustomer(userData: any) {
  const response = await fetch('https://api.abacatepay.com/v2/customers/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`
    },
    body: JSON.stringify({
      email: userData.email,
      name: userData.name,
      taxId: userData.taxId,
      cellphone: userData.cellphone,
      zipCode: userData.zipCode || "00000000"
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erro ao criar cliente");
  
  return data.data.id; // Retorna o cust_...
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Cria o cliente automaticamente para cada nova compra
    const customerId = await createAbacateCustomer(body);

    // 2. Cria a assinatura vinculada ao cliente recém-criado
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
            id: "prod_f1p0jFTuxDXpzftezmxwZjwR", // Seu ID de produto fixo
            quantity: 1 
          }
        ],
        customerId: customerId,
        externalId: `subs-${Date.now()}`, // Gerando um ID único baseado no tempo
        completionUrl: "https://seusite.com/sucesso",
        methods: ["CARD"] // Focado em Cartão para gerar MRR
      })
    });

    const abacateData = await response.json();

    if (!response.ok) {
      console.log("ERRO AO CRIAR ASSINATURA:", abacateData);
      return NextResponse.json({ error: abacateData.error }, { status: response.status });
    }

    // 3. Retornamos apenas o necessário para o Frontend
    // Protegemos dados sensíveis e enviamos a URL de redirecionamento
    return NextResponse.json({
      success: true,
      subscriptionId: abacateData.data.id,
      checkoutUrl: abacateData.data.url, // URL para o window.location.href
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