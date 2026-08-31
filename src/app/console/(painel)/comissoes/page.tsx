"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Empty,
    PageTitle,
    Spinner,
    StatCard,
    Table,
    brl,
    dateBR,
} from "@/components/console/ui";
import { COMMISSION_STATUS_LABEL } from "@/lib/platform/constants";

type Commission = {
    id: string; amount: number; baseAmount: number; percent: number;
    competence: string; status: string; createdAt: string;
    affiliate: { id: string; name: string; code: string; pixKey: string | null; pixKeyType: string | null };
    referral: { barbershop: { id: string; name: string | null } };
    transaction: { paidAt: string; eventType: string };
};

const FILTERS = [
    { value: "PENDING", label: "Pendentes" },
    { value: "APPROVED", label: "Aprovadas" },
    { value: "PAID", label: "Pagas" },
    { value: "REVERSED", label: "Estornadas" },
    { value: "", label: "Todas" },
];

export default function ComissoesPage() {
    const [commissions, setCommissions] = useState<Commission[] | null>(null);
    const [totals, setTotals] = useState<{ status: string; amount: number; count: number }[]>([]);
    const [status, setStatus] = useState("PENDING");
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const load = useCallback(async () => {
        const params = new URLSearchParams();
        if (status) params.set("status", status);

        const res = await fetch(`/api/console/commissions?${params}`);
        const data = await res.json();
        setCommissions(data.commissions ?? []);
        setTotals(data.totals ?? []);
        setSelected(new Set());
    }, [status]);

    useEffect(() => { load(); }, [load]);

    const totalOf = (s: string) => totals.find((t) => t.status === s)?.amount ?? 0;

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const bulk = async (action: "APPROVE" | "REVERSE") => {
        if (selected.size === 0) return;
        setBusy(true);

        const res = await fetch("/api/console/commissions", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: [...selected], action }),
        });

        const data = await res.json();
        setBusy(false);
        setMessage(
            res.ok
                ? `${data.updated} de ${data.requested} comissões atualizadas.`
                : data.error ?? "Erro ao atualizar."
        );
        load();
    };

    // Fecha o repasse de um afiliado: soma tudo que está APPROVED e marca como pago.
    const payout = async (affiliateId: string, affiliateName: string) => {
        const reference = window.prompt(
            `Repasse para ${affiliateName}.\nCole o comprovante / ID da transferência (opcional):`
        );
        if (reference === null) return;

        setBusy(true);
        const res = await fetch("/api/console/payouts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ affiliateId, reference }),
        });

        const data = await res.json();
        setBusy(false);
        setMessage(
            res.ok
                ? `Repasse de ${brl(data.payout.amount)} registrado (${data.commissions} comissões).`
                : data.error ?? "Erro ao gerar repasse."
        );
        load();
    };

    // Agrupa por afiliado para oferecer o botão de repasse por pessoa.
    const byAffiliate = new Map<string, { name: string; total: number }>();
    if (status === "APPROVED") {
        for (const c of commissions ?? []) {
            const entry = byAffiliate.get(c.affiliate.id) ?? { name: c.affiliate.name, total: 0 };
            entry.total += c.amount;
            byAffiliate.set(c.affiliate.id, entry);
        }
    }

    return (
        <>
            <PageTitle
                title="Comissões"
                subtitle="Fluxo: pendente → aprovada → paga. Aprovar é onde você confere que o pagamento do indicado não voltou."
            />

            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Pendentes" value={brl(totalOf("PENDING"))} tone="accent" />
                <StatCard label="Aprovadas" value={brl(totalOf("APPROVED"))} />
                <StatCard label="Pagas" value={brl(totalOf("PAID"))} tone="success" />
                <StatCard label="Estornadas" value={brl(totalOf("REVERSED"))} tone="danger" />
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setStatus(f.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${status === f.value ? "bg-[#B27B5C]/15 text-[#D49A62]" : "text-[#9CA3AF] hover:text-white"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}

                {selected.size > 0 && (
                    <div className="ml-auto flex gap-2">
                        <Button onClick={() => bulk("APPROVE")} disabled={busy}>
                            Aprovar {selected.size}
                        </Button>
                        <Button variant="danger" onClick={() => bulk("REVERSE")} disabled={busy}>
                            Estornar {selected.size}
                        </Button>
                    </div>
                )}
            </div>

            {message && (
                <p className="mb-4 rounded-xl border border-white/10 bg-[#101012] px-4 py-2.5 text-xs text-[#9CA3AF]">
                    {message}
                </p>
            )}

            {byAffiliate.size > 0 && (
                <div className="mb-6">
                    <Card title="Fechar repasse">
                        <div className="flex flex-wrap gap-3">
                            {[...byAffiliate].map(([id, { name, total }]) => (
                                <div key={id} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-2.5">
                                    <div>
                                        <p className="text-sm font-semibold text-white">{name}</p>
                                        <p className="text-xs text-[#8E8E93]">{brl(total)} aprovado</p>
                                    </div>
                                    <Button onClick={() => payout(id, name)} disabled={busy}>Pagar</Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            <Card>
                {!commissions ? (
                    <Spinner />
                ) : commissions.length === 0 ? (
                    <Empty>Nenhuma comissão neste filtro.</Empty>
                ) : (
                    <Table head={["", "Embaixador", "Barbearia", "Base", "%", "Comissão", "Competência", "Pago em", "Status"]}>
                        {commissions.map((c) => (
                            <tr key={c.id} className="border-b border-white/5 last:border-0">
                                <td className="px-3 py-3">
                                    {(c.status === "PENDING" || c.status === "APPROVED") && (
                                        <input
                                            type="checkbox"
                                            checked={selected.has(c.id)}
                                            onChange={() => toggle(c.id)}
                                            className="h-4 w-4 accent-[#B27B5C]"
                                        />
                                    )}
                                </td>
                                <td className="px-3 py-3">
                                    <p className="font-semibold text-white">{c.affiliate.name}</p>
                                    <p className="font-mono text-[10px] text-[#8E8E93]">{c.affiliate.code}</p>
                                    {c.affiliate.pixKey && (
                                        <p className="text-[10px] text-[#5A5A5F]">
                                            PIX {c.affiliate.pixKeyType}: {c.affiliate.pixKey}
                                        </p>
                                    )}
                                </td>
                                <td className="px-3 py-3 text-[#9CA3AF]">
                                    {c.referral.barbershop.name ?? "—"}
                                </td>
                                <td className="px-3 py-3 text-[#8E8E93]">{brl(c.baseAmount)}</td>
                                <td className="px-3 py-3 text-[#8E8E93]">{c.percent}%</td>
                                <td className="px-3 py-3 font-bold text-[#D49A62]">{brl(c.amount)}</td>
                                <td className="px-3 py-3 text-[#8E8E93]">{c.competence}</td>
                                <td className="px-3 py-3 text-[#8E8E93]">{dateBR(c.transaction.paidAt)}</td>
                                <td className="px-3 py-3">
                                    <Badge value={c.status} label={COMMISSION_STATUS_LABEL[c.status]} />
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>
        </>
    );
}
