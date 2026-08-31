import { randomUUID } from "crypto";
import prisma from "@/lib/prisma";
import { normalizeAffiliateCode, REFERRAL_COOKIE } from "./constants";
import {
    deviceFromUserAgent,
    sourceFromReferer,
    VISITOR_COOKIE,
    type FunnelStep,
} from "./funnel";

/**
 * Gravação de eventos do funil.
 *
 * Regras que valem para todo evento:
 *  - Nunca lança. Métrica não pode derrubar cadastro nem pagamento.
 *  - O visitorId vem SEMPRE do cookie httpOnly, nunca do corpo da requisição.
 *  - Metadata é limitada em tamanho e não carrega dado pessoal.
 */

const MAX_METADATA_CHARS = 2000;
const MAX_KEY_LENGTH = 60;

export type TrackContext = {
    visitorId: string;
    userAgent?: string | null;
    referer?: string | null;
    host?: string | null;
    path?: string | null;
};

/** Garante que o visitante existe e atualiza a atribuição no primeiro toque. */
export async function ensureVisitor(ctx: TrackContext, referralCode?: string | null) {
    const code = referralCode ? normalizeAffiliateCode(referralCode) : null;

    let affiliateId: string | null = null;
    if (code) {
        const affiliate = await prisma.affiliate.findUnique({
            where: { code },
            select: { id: true, status: true },
        });
        // Só embaixador ativo entra na atribuição, igual à regra da comissão.
        if (affiliate?.status === "ACTIVE") affiliateId = affiliate.id;
    }

    const device = deviceFromUserAgent(ctx.userAgent ?? null);
    const source = sourceFromReferer(ctx.referer ?? null, ctx.host ?? null);

    return prisma.visitor.upsert({
        where: { id: ctx.visitorId },
        create: {
            id: ctx.visitorId,
            affiliateId,
            affiliateCode: affiliateId ? code : null,
            device,
            source,
            landingPath: ctx.path ?? null,
        },
        update: {
            lastSeenAt: new Date(),
            // A atribuição só é gravada se ainda não existir: o primeiro
            // embaixador que trouxe a pessoa é quem fica com o crédito.
            ...(affiliateId ? { affiliateId, affiliateCode: code } : {}),
        },
    });
}

export async function track(
    ctx: TrackContext,
    step: FunnelStep,
    options: { key?: string; metadata?: Record<string, unknown>; referralCode?: string | null } = {}
) {
    try {
        const visitor = await ensureVisitor(ctx, options.referralCode);
        const key = (options.key ?? "").slice(0, MAX_KEY_LENGTH);

        let metadata = options.metadata ?? undefined;
        if (metadata && JSON.stringify(metadata).length > MAX_METADATA_CHARS) {
            metadata = { truncated: true };
        }

        const now = new Date();

        // Uma linha por (visitante, etapa, chave). Revisita incrementa o
        // contador em vez de duplicar — o funil quer "chegou aqui", não
        // "chegou aqui 40 vezes".
        await prisma.funnelEvent.upsert({
            where: { visitorId_step_key: { visitorId: visitor.id, step, key } },
            create: {
                visitorId: visitor.id,
                step,
                key,
                affiliateId: visitor.affiliateId,
                barbershopId: visitor.barbershopId,
                metadata: metadata as never,
                firstAt: now,
                lastAt: now,
            },
            update: { occurrences: { increment: 1 }, lastAt: now },
        });

        return true;
    } catch (error) {
        console.error(`⚠️ Falha ao registrar evento de funil (${step}):`, error);
        return false;
    }
}

/**
 * Amarra o visitante à barbearia criada e carimba os eventos anteriores dele.
 *
 * É o que permite perguntar "quantos dos que o Carlos trouxe viraram pagantes":
 * sem esse carimbo, o rastro anônimo e a conta ficam em mundos separados.
 */
export async function linkVisitorToBarbershop(visitorId: string, barbershopId: string) {
    try {
        await prisma.$transaction([
            prisma.visitor.update({ where: { id: visitorId }, data: { barbershopId } }),
            prisma.funnelEvent.updateMany({ where: { visitorId }, data: { barbershopId } }),
        ]);
        return true;
    } catch (error) {
        console.error("⚠️ Falha ao vincular visitante à barbearia:", error);
        return false;
    }
}

/**
 * Evento disparado a partir do servidor para uma barbearia já existente
 * (ativação e pagamento), onde não há cookie de visitante na mão — o caso do
 * webhook, por exemplo.
 */
export async function trackForBarbershop(
    barbershopId: string,
    step: FunnelStep,
    options: { key?: string; metadata?: Record<string, unknown> } = {}
) {
    try {
        const visitor = await prisma.visitor.findFirst({
            where: { barbershopId },
            orderBy: { firstSeenAt: "asc" },
            select: { id: true, affiliateId: true },
        });

        // Barbearia criada antes do rastreamento existir não tem visitante.
        // Registrar assim mesmo, sem visitante, quebraria a FK — melhor pular.
        if (!visitor) return false;

        const key = (options.key ?? "").slice(0, MAX_KEY_LENGTH);
        const now = new Date();

        await prisma.funnelEvent.upsert({
            where: { visitorId_step_key: { visitorId: visitor.id, step, key } },
            create: {
                visitorId: visitor.id,
                step,
                key,
                affiliateId: visitor.affiliateId,
                barbershopId,
                metadata: options.metadata as never,
                firstAt: now,
                lastAt: now,
            },
            update: { occurrences: { increment: 1 }, lastAt: now },
        });

        return true;
    } catch (error) {
        console.error(`⚠️ Falha ao registrar evento de barbearia (${step}):`, error);
        return false;
    }
}

export function newVisitorId() {
    return randomUUID();
}

export { VISITOR_COOKIE, REFERRAL_COOKIE };
