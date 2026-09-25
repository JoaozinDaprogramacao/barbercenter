import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { trackForBarbershop } from '@/lib/platform/track';

// Função auxiliar para traduzir erros comuns de Gateways/AbacatePay
function translateAbacateError(rawError: string): string {
  try {
    const parsed = JSON.parse(rawError);
    // Tenta pegar a mensagem de erro de dentro do JSON da AbacatePay
    const msg = parsed.error || parsed.message || (parsed.errors && parsed.errors[0]?.message) || rawError;
    const lowerMsg = msg.toLowerCase();

    if (lowerMsg.includes('tax') || lowerMsg.includes('cpf') || lowerMsg.includes('cnpj')) {
      return "O CPF ou CNPJ informado é inválido. Verifique os números.";
    }
    if (lowerMsg.includes('email')) {
      return "O e-mail informado é inválido ou já está cadastrado.";
    }
    if (lowerMsg.includes('phone') || lowerMsg.includes('cellphone') || lowerMsg.includes('telefone')) {
      return "O número de celular informado é inválido.";
    }
    
    // Retorna a própria mensagem se for algo legível, ou uma mensagem genérica
    return "Verifique os dados informados (CPF e Celular) e tente novamente.";
  } catch {
    return "Não foi possível validar seus dados no banco central. Verifique as informações.";
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!rawBody) return NextResponse.json({ error: "Preencha todos os dados solicitados." }, { status: 400 });
    
    const body = JSON.parse(rawBody);
    const { name, email, taxId, cellphone } = body;

    // O userId sai da sessão, não do body: se viesse do cliente, dava pra
    // gerar cobrança PIX em nome de qualquer outra barbearia.
    const session = await getServerSession(authOptions);
    const userId = session?.user?.scope === 'PLATFORM' ? null : session?.user?.id;

    if (!userId) return NextResponse.json({ error: "Sua sessão expirou. Faça login novamente." }, { status: 401 });
    if (!taxId || !cellphone) return NextResponse.json({ error: "CPF/CNPJ e Celular são obrigatórios." }, { status: 400 });

    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { barbershop: true } 
    });

    if (!user || !user.barbershop) {
        return NextResponse.json({ error: "Não encontramos o cadastro da sua barbearia." }, { status: 404 });
    }

    // 📊 Funil: a pessoa chegou na tela de pagamento e pediu a cobrança.


    await trackForBarbershop(user.barbershopId, 'CHECKOUT_START', { key: 'pix' });



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
        // Traduz o erro da AbacatePay para o usuário
        const friendlyMessage = translateAbacateError(errorData);
        return NextResponse.json({ error: friendlyMessage, detalhes: errorData }, { status: 400 });
      }

      const customerData = await customerRes.json();
      customerId = customerData.data.id;

      // Atualiza a tabela Barbershop e captura o erro de CPF/CNPJ duplicado
      try {
        await prisma.barbershop.update({
          where: { id: user.barbershopId },
          data: { abacateCustomerId: customerId }
        });
      } catch (updateError: any) {
        // P2002 é o erro do Prisma para violação de @unique
        if (updateError.code === 'P2002') {
          return NextResponse.json({ error: "Este CPF/CNPJ ou E-mail já está atrelado a outra assinatura no sistema." }, { status: 400 });
        }
        // Se for outro erro, joga pro catch principal
        throw updateError;
      }
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
      return NextResponse.json({ error: "Sistema de pagamentos instável no momento. Tente em alguns minutos." }, { status: 400 });
    }

    const abacateData = await pixRes.json();

    return NextResponse.json({
      qr_code_base64: abacateData.data.brCodeBase64,
      pix_code: abacateData.data.brCode,
      payment_id: abacateData.data.id
    });

  } catch (error: any) {
    console.error("Erro interno:", error);
    return NextResponse.json({ error: 'Ops! Ocorreu um erro interno. Nossa equipe já foi notificada.' }, { status: 500 });
  }
}