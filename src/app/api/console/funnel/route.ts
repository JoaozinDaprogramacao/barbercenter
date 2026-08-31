import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requirePlatformActor } from "@/lib/platform/auth";
import { FUNNEL_STEPS, MAIN_PATH, STEP_META, type FunnelStep } from "@/lib/platform/funnel";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const gate = await requirePlatformActor();
    if (gate.error) return gate.error;

    try {
        const url = new URL(req.url);
        const days = Math.min(Math.max(Number(url.searchParams.get("days") ?? 30), 1), 365);
        const segment = url.searchParams.get("segment") ?? "all"; // all | organic | <affiliateId>

        const since = new Date();
        since.setDate(since.getDate() - days);
        since.setHours(0, 0, 0, 0);

        // "Orgânico" é ausência de embaixador, não um embaixador chamado
        // orgânico — por isso o filtro é null, não um id.
        const segmentFilter =
            segment === "all" ? {} : segment === "organic" ? { affiliateId: null } : { affiliateId: segment };

        const where = { firstAt: { gte: since }, ...segmentFilter };

        // Visitantes distintos por etapa. Um funil que conta EVENTOS em vez de
        // PESSOAS mente: quem recarrega a landing dez vezes viraria dez.
        const grouped = await prisma.funnelEvent.groupBy({
            by: ["step"],
            where,
            _count: { visitorId: true },
        });

        const counts = new Map<string, number>();
        for (const g of grouped) counts.set(g.step, g._count.visitorId);

        // Abandono por campo do cadastro: quantos preencheram cada um.
        const fieldRows = await prisma.funnelEvent.groupBy({
            by: ["key"],
            where: { ...where, step: "SIGNUP_FIELD" },
            _count: { visitorId: true },
        });

        // Erros que a pessoa recebeu ao tentar criar a conta.
        const errorRows = await prisma.funnelEvent.groupBy({
            by: ["key"],
            where: { ...where, step: "SIGNUP_ERROR" },
            _count: { visitorId: true },
            orderBy: { _count: { visitorId: "desc" } },
            take: 10,
        });

        // Qual CTA a pessoa clicou — diz onde na página a decisão acontece.
        const ctaRows = await prisma.funnelEvent.groupBy({
            by: ["key"],
            where: { ...where, step: "CTA_CLICK" },
            _count: { visitorId: true },
            orderBy: { _count: { visitorId: "desc" } },
        });

        const [deviceRows, sourceRows] = await Promise.all([
            prisma.visitor.groupBy({
                by: ["device"],
                where: { firstSeenAt: { gte: since }, ...segmentFilter },
                _count: { _all: true },
            }),
            prisma.visitor.groupBy({
                by: ["source"],
                where: { firstSeenAt: { gte: since }, ...segmentFilter },
                _count: { _all: true },
                orderBy: { _count: { source: "desc" } },
                take: 8,
            }),
        ]);

        // A linha principal do funil, com queda de uma etapa para a seguinte.
        const path = MAIN_PATH.filter((step) => (counts.get(step) ?? 0) > 0 || step === "PAID");

        // O topo é o ponto MAIS LARGO, não a primeira etapa: LINK_CLICK só
        // acontece para quem veio por embaixador, então num segmento que mistura
        // link e orgânico a etapa seguinte é maior que a primeira — e o funil
        // exibiria "150% do topo", que não quer dizer nada.
        const topCount = path.reduce((max, step) => Math.max(max, counts.get(step) ?? 0), 0);

        let previous = topCount;
        const steps = path.map((step, index) => {
            const value = counts.get(step) ?? 0;
            const fromPrevious = index === 0 ? 1 : previous > 0 ? value / previous : 0;
            const dropped = index === 0 ? 0 : Math.max(previous - value, 0);
            const row = {
                step,
                label: STEP_META[step].label,
                stage: STEP_META[step].stage,
                hint: STEP_META[step].hint ?? null,
                visitors: value,
                fromTop: topCount > 0 ? value / topCount : 0,
                fromPrevious,
                dropped,
            };
            previous = value;
            return row;
        });

        // A maior queda é o que merece atenção primeiro — mas só é apontada com
        // volume mínimo. Dizer "seu maior vazamento é X" com base em 3 pessoas
        // manda otimizar ruído, o que é pior que não dizer nada.
        const MIN_VOLUME_FOR_INSIGHT = 30;

        const biggestDrop =
            topCount < MIN_VOLUME_FOR_INSIGHT
                ? null
                : steps
                    .slice(1)
                    .reduce<(typeof steps)[number] | null>(
                        (worst, s) => (!worst || s.dropped > worst.dropped ? s : worst),
                        null
                    );

        const affiliates = await prisma.affiliate.findMany({
            where: { status: { in: ["ACTIVE", "PAUSED"] } },
            select: { id: true, name: true, code: true, status: true },
            orderBy: { name: "asc" },
        });

        return NextResponse.json({
            days,
            segment,
            steps,
            biggestDrop,
            // Avisa a tela quando o volume ainda não sustenta conclusão.
            lowVolume: topCount < MIN_VOLUME_FOR_INSIGHT,
            topCount,
            offPath: {
                fields: fieldRows
                    .map((r) => ({ key: r.key, visitors: r._count.visitorId }))
                    .sort((a, b) => b.visitors - a.visitors),
                errors: errorRows.map((r) => ({ key: r.key, visitors: r._count.visitorId })),
                ctas: ctaRows.map((r) => ({ key: r.key || "(sem origem)", visitors: r._count.visitorId })),
                extras: (["ACTIVATION_TEAM_ADDED", "ACTIVATION_LINK_SHARED"] as FunnelStep[]).map((s) => ({
                    step: s,
                    label: STEP_META[s].label,
                    visitors: counts.get(s) ?? 0,
                })),
            },
            audience: {
                devices: deviceRows.map((d) => ({ device: d.device ?? "desconhecido", visitors: d._count._all })),
                sources: sourceRows.map((s) => ({ source: s.source ?? "direto", visitors: s._count._all })),
            },
            affiliates,
            // Útil para saber se já há volume suficiente para tirar conclusão.
            totalTracked: FUNNEL_STEPS.reduce((sum, s) => sum + (counts.get(s) ?? 0), 0),
        });
    } catch (error) {
        console.error("Erro ao montar funil:", error);
        return NextResponse.json({ error: "Erro ao carregar funil" }, { status: 500 });
    }
}
