"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import {
    Badge,
    Card,
    Empty,
    PageTitle,
    Spinner,
    StatCard,
    brl,
    pct,
} from "@/components/console/ui";

type Metrics = {
    barbershops: {
        total: number; paying: number; trialActive: number; trialExpired: number;
        free: number; newLast7: number; newLast30: number; trialToPaidRate: number;
    };
    usage: { totalUsers: number; totalAppointments: number; appointments30: number };
    revenue: { last30: number; transactions30: number; currentMonth: number; allTime: number; mrr: number };
    affiliates: {
        total: number; active: number; clicks30: number; referrals: number;
        referralsActive: number; referralsTrial: number; referralsChurned: number;
        clickToSignupRate: number; commissionPending: number;
        commissionApproved: number; commissionPaid: number;
        missedClicks30: number;
        misses: { code: string; reason: string; count: number }[];
    };
    series: {
        signups: { date: string; count: number }[];
        revenue: { month: string; amount: number }[];
    };
};

const MONTH_LABEL = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function monthLabel(competence: string) {
    const [year, month] = competence.split("-");
    return `${MONTH_LABEL[Number(month) - 1]}/${year.slice(2)}`;
}

/** Barras proporcionais ao maior valor da série — sem eixo, só a forma. */
function BarChart({ data }: { data: { label: string; value: number; caption: string }[] }) {
    const max = Math.max(...data.map((d) => d.value), 1);

    return (
        <div className="flex items-end gap-2" style={{ height: 160 }}>
            {data.map((d) => (
                <div key={d.label} className="group flex flex-1 flex-col items-center gap-2">
                    <span className="text-[10px] text-[#8E8E93] opacity-0 transition-opacity group-hover:opacity-100">
                        {d.caption}
                    </span>
                    <div className="flex w-full flex-1 items-end">
                        <div
                            className="w-full rounded-t-md bg-[#B27B5C] transition-all group-hover:bg-[#D49A62]"
                            style={{ height: `${Math.max((d.value / max) * 100, 2)}%` }}
                        />
                    </div>
                    <span className="text-[10px] text-[#8E8E93]">{d.label}</span>
                </div>
            ))}
        </div>
    );
}

export default function ConsoleDashboard() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/console/metrics")
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Falha ao carregar"))))
            .then(setMetrics)
            .catch((e) => setError(e.message));
    }, []);

    if (error) return <Empty>{error}</Empty>;
    if (!metrics) return <Spinner />;

    const { barbershops, usage, revenue, affiliates, series } = metrics;

    // 30 dias em barras diárias fica ilegível; agrupo em 10 blocos de 3 dias.
    const signupBlocks = Array.from({ length: 10 }, (_, i) => {
        const slice = series.signups.slice(i * 3, i * 3 + 3);
        const count = slice.reduce((sum, d) => sum + d.count, 0);
        const day = slice[0]?.date.slice(8) ?? "";
        return { label: day, value: count, caption: `${count} cadastro${count === 1 ? "" : "s"}` };
    });

    return (
        <>
            <PageTitle
                title="Visão geral"
                subtitle="Saúde da plataforma nos últimos 30 dias."
            />

            {/* Link de embaixador que não atribui ninguém é dinheiro saindo em
                silêncio: a pessoa se cadastra, o embaixador não comissiona, e
                a conta só aparece quando ele cobrar. Por isso vem antes de tudo. */}
            {affiliates.missedClicks30 > 0 && (
                <div className="mb-6 rounded-2xl border border-[#F87171]/30 bg-[#F87171]/[0.07] p-5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#F87171]" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-white">
                                {affiliates.missedClicks30} clique{affiliates.missedClicks30 === 1 ? "" : "s"} de indicação perdido{affiliates.missedClicks30 === 1 ? "" : "s"} nos últimos 30 dias
                            </p>
                            <p className="mt-1 text-xs text-[#9CA3AF]">
                                Esse tráfego chegou por um link <code className="text-[#D49A62]">/r/</code> e não foi
                                atribuído a ninguém. Quem se cadastrou entrou como orgânico.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {affiliates.misses.map((m) => (
                                    <span
                                        key={`${m.code}-${m.reason}`}
                                        className="rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-xs"
                                    >
                                        <code className="font-bold text-[#D49A62]">{m.code}</code>
                                        <span className="ml-2 text-[#8E8E93]">
                                            {m.count}× ·{" "}
                                            {m.reason === "NOT_FOUND"
                                                ? "código não existe"
                                                : "embaixador não está ativo"}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                    label="MRR estimado"
                    value={brl(revenue.mrr)}
                    hint={`${barbershops.paying} barbearias pagantes`}
                    tone="accent"
                />
                <StatCard
                    label="Receita do mês"
                    value={brl(revenue.currentMonth)}
                    hint={`${brl(revenue.last30)} nos últimos 30d`}
                />
                <StatCard
                    label="Barbearias"
                    value={barbershops.total}
                    hint={`+${barbershops.newLast7} nos últimos 7 dias`}
                />
                <StatCard
                    label="Conversão para pago"
                    value={pct(barbershops.trialToPaidRate)}
                    hint={`${barbershops.trialActive} em trial ativo`}
                    tone={barbershops.trialToPaidRate >= 0.1 ? "success" : "default"}
                />
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-2">
                <Card title="Novos cadastros (30 dias)">
                    {series.signups.every((s) => s.count === 0) ? (
                        <Empty>Sem cadastros no período.</Empty>
                    ) : (
                        <BarChart data={signupBlocks} />
                    )}
                </Card>

                <Card title="Receita por mês (6 meses)">
                    {series.revenue.every((r) => r.amount === 0) ? (
                        <Empty>Nenhum pagamento registrado ainda.</Empty>
                    ) : (
                        <BarChart
                            data={series.revenue.map((r) => ({
                                label: monthLabel(r.month),
                                value: r.amount,
                                caption: brl(r.amount),
                            }))}
                        />
                    )}
                </Card>
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-2">
                <Card title="Base de clientes">
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard label="Pagantes" value={barbershops.paying} tone="success" />
                        <StatCard label="Trial ativo" value={barbershops.trialActive} tone="accent" />
                        <StatCard label="Trial vencido" value={barbershops.trialExpired} tone="danger" />
                        <StatCard label="Cancelados" value={barbershops.free} />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                        <StatCard label="Usuários" value={usage.totalUsers} />
                        <StatCard label="Agendamentos" value={usage.totalAppointments} />
                        <StatCard label="Agend. 30d" value={usage.appointments30} />
                    </div>
                </Card>

                <Card
                    title="Programa de embaixadores"
                    action={
                        <Link
                            href="/console/afiliados"
                            className="text-xs font-bold uppercase tracking-widest text-[#D49A62] hover:underline"
                        >
                            Gerenciar
                        </Link>
                    }
                >
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            label="Embaixadores ativos"
                            value={affiliates.active}
                            hint={`${affiliates.total} no total`}
                            tone="accent"
                        />
                        <StatCard
                            label="Cliques (30d)"
                            value={affiliates.clicks30}
                            hint={`${pct(affiliates.clickToSignupRate)} viram cadastro`}
                        />
                        <StatCard
                            label="Indicações pagando"
                            value={affiliates.referralsActive}
                            hint={`${affiliates.referralsTrial} ainda em trial`}
                            tone="success"
                        />
                        <StatCard
                            label="Comissão a pagar"
                            value={brl(affiliates.commissionPending + affiliates.commissionApproved)}
                            hint={`${brl(affiliates.commissionPaid)} já repassado`}
                            tone="danger"
                        />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4 text-xs text-[#8E8E93]">
                        <Badge value="TRIAL" label={`${affiliates.referralsTrial} em trial`} />
                        <Badge value="ACTIVE" label={`${affiliates.referralsActive} pagando`} />
                        <Badge value="CHURNED" label={`${affiliates.referralsChurned} cancelaram`} />
                    </div>
                </Card>
            </div>
        </>
    );
}
