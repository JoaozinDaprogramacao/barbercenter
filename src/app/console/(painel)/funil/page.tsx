"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, TrendingDown } from "lucide-react";
import { Card, Empty, PageTitle, Spinner, StatCard, pct } from "@/components/console/ui";
import { STAGE_LABEL, type FunnelStage } from "@/lib/platform/funnel";

type Step = {
    step: string; label: string; stage: FunnelStage; hint: string | null;
    visitors: number; fromTop: number; fromPrevious: number; dropped: number;
};

type Funnel = {
    days: number; segment: string; steps: Step[]; biggestDrop: Step | null;
    lowVolume: boolean; topCount: number;
    offPath: {
        fields: { key: string; visitors: number }[];
        errors: { key: string; visitors: number }[];
        ctas: { key: string; visitors: number }[];
        extras: { step: string; label: string; visitors: number }[];
    };
    audience: {
        devices: { device: string; visitors: number }[];
        sources: { source: string; visitors: number }[];
    };
    affiliates: { id: string; name: string; code: string; status: string }[];
    totalTracked: number;
};

const STAGE_COLOR: Record<FunnelStage, string> = {
    AQUISICAO: "#B27B5C",
    CADASTRO: "#D49A62",
    ATIVACAO: "#60A5FA",
    PAGAMENTO: "#82D173",
};

const FIELD_LABEL: Record<string, string> = {
    userName: "Seu nome",
    userEmail: "E-mail",
    barbershopName: "Nome da barbearia",
    password: "Senha",
};

const PERIODS = [7, 30, 90];

export default function FunilPage() {
    const [data, setData] = useState<Funnel | null>(null);
    const [days, setDays] = useState(30);
    const [segment, setSegment] = useState("all");
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await fetch(`/api/console/funnel?days=${days}&segment=${segment}`);
        const json = await res.json();
        setData(res.ok ? json : null);
        setLoading(false);
    }, [days, segment]);

    useEffect(() => { load(); }, [load]);

    if (loading && !data) return <Spinner />;
    if (!data) return <Empty>Não foi possível carregar o funil.</Empty>;

    const { steps, biggestDrop, offPath, audience, affiliates } = data;
    const top = steps[0]?.visitors ?? 0;
    const paid = steps.find((s) => s.step === "PAID")?.visitors ?? 0;
    const accounts = steps.find((s) => s.step === "SIGNUP_SUCCESS")?.visitors ?? 0;

    return (
        <>
            <PageTitle
                title="Funil de aquisição"
                subtitle="Do clique no link até virar pagante, passo a passo. Conta pessoas distintas, não pageviews."
            />

            <div className="mb-6 flex flex-wrap items-center gap-2">
                {PERIODS.map((d) => (
                    <button
                        key={d}
                        onClick={() => setDays(d)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${days === d ? "bg-[#B27B5C]/15 text-[#D49A62]" : "text-[#9CA3AF] hover:text-white"
                            }`}
                    >
                        {d} dias
                    </button>
                ))}

                <select
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="ml-auto rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#B27B5C]"
                >
                    <option value="all">Todo o tráfego</option>
                    <option value="organic">Só orgânico</option>
                    {affiliates.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.name} ({a.code})
                        </option>
                    ))}
                </select>
            </div>

            {data.totalTracked === 0 ? (
                <Empty>
                    Nenhum evento no período. O rastreamento começa a preencher assim que alguém
                    acessar a landing ou um link de embaixador.
                </Empty>
            ) : (
                <>
                    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <StatCard label="Entraram no funil" value={top} tone="accent" />
                        <StatCard label="Criaram conta" value={accounts} hint={pct(top > 0 ? accounts / top : 0)} />
                        <StatCard label="Viraram pagantes" value={paid} hint={pct(top > 0 ? paid / top : 0)} tone="success" />
                        <StatCard
                            label="Maior queda"
                            value={biggestDrop ? `-${biggestDrop.dropped}` : "—"}
                            hint={biggestDrop?.label}
                            tone="danger"
                        />
                    </div>

                    {data.lowVolume && (
                        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#D49A62]" />
                            <p className="text-sm text-[#9CA3AF]">
                                Volume ainda baixo ({data.topCount} pessoas no topo). Os números já
                                aparecem, mas não aponto "maior queda" com essa amostra — otimizar em
                                cima de ruído custa mais que não mexer. Volte quando passar de 30.
                            </p>
                        </div>
                    )}

                    {biggestDrop && biggestDrop.dropped > 0 && (
                        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#F87171]/25 bg-[#F87171]/[0.06] p-5">
                            <TrendingDown size={18} className="mt-0.5 shrink-0 text-[#F87171]" />
                            <p className="text-sm text-[#9CA3AF]">
                                A maior perda está em{" "}
                                <strong className="text-white">{biggestDrop.label}</strong>:{" "}
                                {biggestDrop.dropped} pessoas chegaram na etapa anterior e não passaram
                                daqui — só {pct(biggestDrop.fromPrevious)} seguiram. É onde mexer primeiro.
                            </p>
                        </div>
                    )}

                    <div className="mb-6">
                        <Card title={`Passo a passo · ${data.days} dias`}>
                            <div className="space-y-2">
                                {steps.map((s, i) => (
                                    <div key={s.step}>
                                        <div className="flex items-baseline justify-between gap-4 text-sm">
                                            <span className="flex items-center gap-2">
                                                <span className="font-semibold text-white">{s.label}</span>
                                                <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                                                    style={{ background: `${STAGE_COLOR[s.stage]}22`, color: STAGE_COLOR[s.stage] }}>
                                                    {STAGE_LABEL[s.stage]}
                                                </span>
                                                {s.hint && <span className="text-[10px] text-[#5A5A5F]">{s.hint}</span>}
                                            </span>
                                            <span className="shrink-0 tabular-nums text-[#9CA3AF]">
                                                <strong className="text-white">{s.visitors}</strong>
                                                <span className="ml-2 text-xs">{pct(s.fromTop)} do topo</span>
                                            </span>
                                        </div>

                                        {/* Barra proporcional ao topo do funil. */}
                                        <div className="mt-1.5 h-7 w-full overflow-hidden rounded-lg bg-white/[0.03]">
                                            <div
                                                className="h-full rounded-lg transition-all"
                                                style={{
                                                    width: `${Math.max(s.fromTop * 100, 0.6)}%`,
                                                    background: STAGE_COLOR[s.stage],
                                                }}
                                            />
                                        </div>

                                        {i < steps.length - 1 && (
                                            <p className="mt-1 pl-1 text-[11px] text-[#5A5A5F]">
                                                ↓ {pct(steps[i + 1].fromPrevious)} seguem
                                                {steps[i + 1].dropped > 0 && (
                                                    <span className="text-[#F87171]"> · {steps[i + 1].dropped} desistem aqui</span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card title="Abandono no formulário">
                            {offPath.fields.length === 0 ? (
                                <Empty>Ninguém começou a preencher no período.</Empty>
                            ) : (
                                <div className="space-y-3">
                                    {offPath.fields.map((f) => (
                                        <div key={f.key} className="flex items-center justify-between text-sm">
                                            <span className="text-[#9CA3AF]">{FIELD_LABEL[f.key] ?? f.key}</span>
                                            <span className="tabular-nums font-semibold text-white">{f.visitors}</span>
                                        </div>
                                    ))}
                                    <p className="border-t border-white/5 pt-3 text-xs text-[#5A5A5F]">
                                        Quantas pessoas preencheram cada campo. O campo onde o número cai
                                        é onde a pessoa desiste.
                                    </p>
                                </div>
                            )}
                        </Card>

                        <Card title="Erros no cadastro">
                            {offPath.errors.length === 0 ? (
                                <Empty>Nenhum erro registrado — bom sinal.</Empty>
                            ) : (
                                <div className="space-y-3">
                                    {offPath.errors.map((e) => (
                                        <div key={e.key} className="flex items-start justify-between gap-3 text-sm">
                                            <span className="flex items-start gap-2 text-[#9CA3AF]">
                                                <AlertTriangle size={13} className="mt-0.5 shrink-0 text-[#F87171]" />
                                                {e.key || "(sem mensagem)"}
                                            </span>
                                            <span className="tabular-nums font-semibold text-white">{e.visitors}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                        <Card title="Qual botão trouxe a pessoa">
                            {offPath.ctas.length === 0 ? (
                                <Empty>Nenhum clique em CTA no período.</Empty>
                            ) : (
                                <div className="space-y-3">
                                    {offPath.ctas.map((c) => (
                                        <div key={c.key} className="flex items-center justify-between text-sm">
                                            <span className="text-[#9CA3AF]">{c.key}</span>
                                            <span className="tabular-nums font-semibold text-white">{c.visitors}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                        <Card title="Público">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8E8E93]">
                                        Dispositivo
                                    </p>
                                    {audience.devices.map((d) => (
                                        <div key={d.device} className="flex justify-between py-1 text-sm">
                                            <span className="text-[#9CA3AF]">{d.device}</span>
                                            <span className="tabular-nums text-white">{d.visitors}</span>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8E8E93]">
                                        Origem
                                    </p>
                                    {audience.sources.map((s) => (
                                        <div key={s.source} className="flex justify-between py-1 text-sm">
                                            <span className="truncate text-[#9CA3AF]">{s.source}</span>
                                            <span className="ml-2 shrink-0 tabular-nums text-white">{s.visitors}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 border-t border-white/5 pt-4">
                                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8E8E93]">
                                    Fora da linha principal
                                </p>
                                {offPath.extras.map((e) => (
                                    <div key={e.step} className="flex justify-between py-1 text-sm">
                                        <span className="text-[#9CA3AF]">{e.label}</span>
                                        <span className="tabular-nums text-white">{e.visitors}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </>
    );
}
