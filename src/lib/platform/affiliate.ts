import prisma from "@/lib/prisma";
import { competenceOf, normalizeAffiliateCode } from "./constants";

/**
 * Regra do programa: 50% recorrente vitalício.
 * Enquanto a barbearia indicada pagar, o embaixador comissiona — sem janela
 * de corte. O percentual é fotografado em `commissions.percent` no momento do
 * pagamento, então mudar o percentual de um afiliado não reescreve o passado.
 */

export function affiliateLink(code: string): string {
    const base = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "";
    return `${base}/r/${code}`;
}

/**
 * Vincula uma barbearia recém-criada ao afiliado do cookie.
 *
 * Nunca lança: uma indicação que não colou não pode derrubar um cadastro.
 * Só afiliado ACTIVE atribui — PENDING/PAUSED/BANNED não gera comissão, e o
 * clique dele já foi contado do mesmo jeito.
 */
export async function attributeReferral(barbershopId: string, rawCode: string | undefined | null) {
    if (!rawCode) return null;

    const code = normalizeAffiliateCode(rawCode);
    if (!code) return null;

    try {
        const affiliate = await prisma.affiliate.findUnique({
            where: { code },
            select: { id: true, status: true },
        });

        if (!affiliate || affiliate.status !== "ACTIVE") return null;

        // barbershopId é @unique: se já existe indicação, a primeira ganha.
        const existing = await prisma.referral.findUnique({ where: { barbershopId } });
        if (existing) return existing;

        return await prisma.referral.create({
            data: { affiliateId: affiliate.id, barbershopId, status: "TRIAL" },
        });
    } catch (error) {
        console.error("⚠️ Falha ao atribuir indicação:", error);
        return null;
    }
}

/**
 * Gera a comissão de um pagamento de assinatura já persistido.
 * Idempotente por `commissions.transactionId` (@unique): webhook repetido não
 * paga duas vezes.
 */
export async function createCommissionForTransaction(transaction: {
    id: string;
    barbershopId: string;
    amount: number;
    paidAt: Date;
}) {
    const referral = await prisma.referral.findUnique({
        where: { barbershopId: transaction.barbershopId },
        include: { affiliate: { select: { id: true, status: true, commissionPercent: true } } },
    });

    if (!referral) return null;
    if (referral.affiliate.status !== "ACTIVE") return null;

    const already = await prisma.commission.findUnique({
        where: { transactionId: transaction.id },
    });
    if (already) return already;

    const percent = referral.affiliate.commissionPercent;
    const amount = Math.round(transaction.amount * (percent / 100) * 100) / 100;

    const [commission] = await prisma.$transaction([
        prisma.commission.create({
            data: {
                affiliateId: referral.affiliateId,
                referralId: referral.id,
                transactionId: transaction.id,
                baseAmount: transaction.amount,
                percent,
                amount,
                competence: competenceOf(transaction.paidAt),
                status: "PENDING",
            },
        }),
        // Primeiro pagamento promove a indicação de TRIAL para ACTIVE.
        prisma.referral.update({
            where: { id: referral.id },
            data: {
                status: "ACTIVE",
                firstPaidAt: referral.firstPaidAt ?? transaction.paidAt,
            },
        }),
    ]);

    return commission;
}

/**
 * Estorno: o pagamento voltou, a comissão tem que voltar junto.
 * Comissão já PAID vira REVERSED do mesmo jeito — o acerto vira débito no
 * próximo repasse, tratado manualmente no painel.
 */
export async function reverseCommissionForTransaction(transactionId: string) {
    const commission = await prisma.commission.findUnique({ where: { transactionId } });
    if (!commission || commission.status === "REVERSED") return null;

    return prisma.commission.update({
        where: { id: commission.id },
        data: { status: "REVERSED", reversedAt: new Date() },
    });
}
