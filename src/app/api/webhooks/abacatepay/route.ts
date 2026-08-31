import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  createCommissionForTransaction,
  reverseCommissionForTransaction,
} from '@/lib/platform/affiliate';
import { competenceOf } from '@/lib/platform/constants';
import { trackForBarbershop } from '@/lib/platform/track';

// Preço do plano em centavos, usado só como último recurso quando o payload
// não traz o valor. Mantido igual ao cobrado em /api/pagamento/pix.
const FALLBACK_AMOUNT_CENTS = Number(process.env.PLATFORM_PLAN_PRICE_CENTS ?? 3290);

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/**
 * Duas checagens, conforme a doc da AbacatePay:
 *  1. `?webhookSecret=` na URL — barreira barata, corta ruído antes do HMAC.
 *  2. `X-Webhook-Signature` — HMAC-SHA256 base64 sobre o corpo CRU.
 *
 * Falha fechada: se nenhum segredo estiver configurado, o endpoint recusa
 * tudo. Um webhook aberto aqui é acesso PRO de graça e, agora que existe
 * programa de afiliado, comissão de 50% em cima de pagamento que nunca houve.
 */
function verifyWebhook(req: Request, rawBody: string): { ok: boolean; reason?: string } {
  const querySecret = new URL(req.url).searchParams.get('webhookSecret');
  const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;
  const publicKey = process.env.ABACATEPAY_PUBLIC_KEY;

  if (!expectedSecret && !publicKey) {
    return { ok: false, reason: 'nenhum segredo de webhook configurado no servidor' };
  }

  if (expectedSecret) {
    if (!querySecret || !safeEqual(querySecret, expectedSecret)) {
      return { ok: false, reason: 'webhookSecret ausente ou incorreto' };
    }
  }

  if (publicKey) {
    const signature = req.headers.get('x-webhook-signature');
    if (!signature) return { ok: false, reason: 'assinatura ausente' };

    const expected = createHmac('sha256', publicKey)
      .update(Buffer.from(rawBody, 'utf8'))
      .digest('base64');

    if (!safeEqual(expected, signature)) {
      return { ok: false, reason: 'assinatura inválida' };
    }
  }

  return { ok: true };
}

/** O valor pode vir em lugares diferentes conforme o tipo de evento. */
function extractAmountCents(data: any): number | null {
  const candidates = [
    data?.amount,
    data?.paidAmount,
    data?.transparent?.amount,
    data?.subscription?.amount,
    data?.charge?.amount,
    data?.items?.[0]?.price,
  ];

  for (const value of candidates) {
    if (typeof value === 'number' && value > 0) return value;
  }

  return null;
}

/**
 * Identificador estável do pagamento, usado como chave de idempotência.
 *
 * Para eventos de assinatura o `data.id` é o id da assinatura e se repete a
 * cada mês — por isso a competência entra na chave, senão a segunda
 * mensalidade seria descartada como duplicata e o afiliado perderia comissão.
 */
function buildExternalId(event: string, data: any, paidAt: Date): string | null {
  const specific = data?.charge?.id ?? data?.payment?.id ?? data?.transaction?.id;
  const base = specific ?? data?.id;

  if (!base) return null;

  const isRecurring = event.startsWith('subscription.');
  return isRecurring ? `${base}:${competenceOf(paidAt)}` : String(base);
}

export async function POST(request: Request) {
  // Precisa do corpo cru e intacto para conferir o HMAC — parsear antes
  // invalidaria a assinatura.
  const rawBody = await request.text();

  const verification = verifyWebhook(request, rawBody);
  if (!verification.ok) {
    console.error(`🚫 Webhook AbacatePay rejeitado: ${verification.reason}`);
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = JSON.parse(rawBody);
    const { event, data } = body;

    const metadata = data.metadata || data.transparent?.metadata || data.subscription?.metadata;
    const userId = metadata?.userId;
    let barbershopId = metadata?.barbershopId;

    if (!userId && !barbershopId) {
      console.warn("⚠️ Webhook recebido, mas não conseguimos encontrar o metadata.");
      console.log("Estrutura recebida:", JSON.stringify(data, null, 2));
      return NextResponse.json({ ok: true });
    }

    // Fallback de segurança: Caso algum PIX antigo tenha sido gerado só com userId
    if (!barbershopId && userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        barbershopId = user.barbershopId;
      } else {
        console.warn(`⚠️ Usuário ${userId} não encontrado para vincular a barbearia.`);
        return NextResponse.json({ ok: true });
      }
    }

    // O metadata é escrito por nós na criação da cobrança, mas ainda assim
    // confirmamos que a barbearia existe antes de mexer em plano ou comissão.
    const barbershop = await prisma.barbershop.findUnique({
      where: { id: barbershopId },
      select: { id: true },
    });

    if (!barbershop) {
      console.warn(`⚠️ Barbearia ${barbershopId} do metadata não existe.`);
      return NextResponse.json({ ok: true });
    }

    switch (event) {
      case 'transparent.completed':
      case 'checkout.completed':
      case 'subscription.completed':
      case 'subscription.renewed': {
        const paidAt = new Date();
        const amountCents = extractAmountCents(data);

        if (amountCents === null) {
          console.warn(
            `⚠️ Evento ${event} sem valor no payload; usando fallback de ${FALLBACK_AMOUNT_CENTS} centavos.`
          );
        }

        const amount = (amountCents ?? FALLBACK_AMOUNT_CENTS) / 100;
        const externalId = buildExternalId(event, data, paidAt);

        await prisma.barbershop.update({
          where: { id: barbershopId },
          data: {
            planStatus: 'PRO',
            planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

        if (externalId) {
          // upsert = idempotência. Reentrega do mesmo evento não duplica
          // faturamento nem comissão.
          const transaction = await prisma.platformTransaction.upsert({
            where: { externalId },
            create: {
              externalId,
              barbershopId,
              amount,
              kind: event.startsWith('subscription.') ? 'SUBSCRIPTION' : 'PIX',
              status: 'PAID',
              eventType: event,
              paidAt,
            },
            update: { status: 'PAID' },
          });

          await createCommissionForTransaction({
            id: transaction.id,
            barbershopId: transaction.barbershopId,
            amount: transaction.amount,
            paidAt: transaction.paidAt,
          });

          // 📊 Última etapa do funil. Registrada aqui e não no checkout porque
          // só o webhook sabe que o dinheiro entrou de verdade.
          await trackForBarbershop(barbershopId, 'PAID', {
            key: event.startsWith('subscription.') ? 'assinatura' : 'pix',
            metadata: { amount },
          });
        } else {
          console.warn(`⚠️ Evento ${event} sem id utilizável; transação não registrada.`);
        }

        console.log(`✅ Acesso PRO liberado para a barbearia: ${barbershopId}`);
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.refunded':
      case 'transparent.refunded':
      case 'checkout.refunded':
      case 'checkout.disputed':
      case 'transparent.disputed': {
        await prisma.barbershop.update({
          where: { id: barbershopId },
          data: {
            planStatus: 'FREE', // Ou 'TRIAL_EXPIRED', dependendo de como você chama
          },
        });

        await prisma.referral.updateMany({
          where: { barbershopId },
          data: { status: 'CHURNED' },
        });

        // Estorno derruba a comissão junto. Cancelamento simples não estorna o
        // que já foi pago — só interrompe o fluxo daqui pra frente.
        const isRefund = event.includes('refunded') || event.includes('disputed');
        const externalId = buildExternalId(event, data, new Date());

        if (isRefund && externalId) {
          const transaction = await prisma.platformTransaction.findUnique({
            where: { externalId },
          });

          if (transaction) {
            await prisma.platformTransaction.update({
              where: { id: transaction.id },
              data: { status: 'REFUNDED' },
            });
            await reverseCommissionForTransaction(transaction.id);
          }
        }

        console.log(`❌ Acesso PRO removido para a barbearia: ${barbershopId}`);
        break;
      }

      default:
        console.log(`ℹ️ Evento ignorado: ${event}`);
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("❌ Erro no processamento do Webhook:", err.message);
    return NextResponse.json({ error: "Payload inválido", detalhes: err.message }, { status: 400 });
  }
}
