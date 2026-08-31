"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Empty,
    PageTitle,
    Spinner,
    Table,
    dateBR,
    inputClass,
} from "@/components/console/ui";

type Barbershop = {
    id: string; name: string | null; planStatus: string; planExpiresAt: string;
    isExpired: boolean; createdAt: string;
    owner: { name: string; email: string } | null;
    users: number; appointments: number; clients: number;
    affiliate: { id: string; name: string; code: string } | null;
    referralStatus: string | null;
};

const FILTERS = [
    { value: "", label: "Todas" },
    { value: "paying", label: "Pagantes" },
    { value: "trial", label: "Trial ativo" },
    { value: "expired", label: "Vencidas" },
    { value: "FREE", label: "Canceladas" },
];

export default function BarbeariasPage() {
    const [barbershops, setBarbershops] = useState<Barbershop[] | null>(null);
    const [total, setTotal] = useState(0);
    const [plan, setPlan] = useState("");
    const [search, setSearch] = useState("");
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const load = useCallback(async () => {
        const params = new URLSearchParams();
        if (plan) params.set("plan", plan);
        if (search) params.set("q", search);

        const res = await fetch(`/api/console/barbershops?${params}`);
        const data = await res.json();
        setBarbershops(data.barbershops ?? []);
        setTotal(data.total ?? 0);
    }, [plan, search]);

    useEffect(() => {
        const timer = setTimeout(load, search ? 300 : 0);
        return () => clearTimeout(timer);
    }, [load, search]);

    const act = async (id: string, action: string, body: Record<string, unknown> = {}) => {
        setBusy(true);
        const res = await fetch(`/api/console/barbershops/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, ...body }),
        });
        const data = await res.json();
        setBusy(false);
        setMessage(res.ok ? "Plano atualizado." : data.error ?? "Erro ao atualizar.");
        load();
    };

    const extend = (id: string) => {
        const days = window.prompt("Estender o acesso por quantos dias? (1 a 90)", "7");
        if (!days) return;
        act(id, "EXTEND_TRIAL", { days: Number(days), reason: "Suporte via console" });
    };

    return (
        <>
            <PageTitle title="Barbearias" subtitle={`${total} contas na base.`} />

            <div className="mb-4 flex flex-wrap items-center gap-2">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setPlan(f.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${plan === f.value ? "bg-[#B27B5C]/15 text-[#D49A62]" : "text-[#9CA3AF] hover:text-white"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nome, telefone ou e-mail do dono"
                    className={`${inputClass} ml-auto max-w-xs`}
                />
            </div>

            {message && (
                <p className="mb-4 rounded-xl border border-white/10 bg-[#101012] px-4 py-2.5 text-xs text-[#9CA3AF]">
                    {message}
                </p>
            )}

            <Card>
                {!barbershops ? (
                    <Spinner />
                ) : barbershops.length === 0 ? (
                    <Empty>Nenhuma barbearia neste filtro.</Empty>
                ) : (
                    <Table head={["Barbearia", "Dono", "Plano", "Vence", "Uso", "Origem", "Cadastro", ""]}>
                        {barbershops.map((b) => (
                            <tr key={b.id} className="border-b border-white/5 last:border-0">
                                <td className="px-3 py-3">
                                    <p className="font-semibold text-white">{b.name ?? "Sem nome"}</p>
                                    <p className="font-mono text-[10px] text-[#5A5A5F]">{b.id.slice(0, 8)}</p>
                                </td>
                                <td className="px-3 py-3">
                                    <p className="text-[#9CA3AF]">{b.owner?.name ?? "—"}</p>
                                    <p className="text-xs text-[#5A5A5F]">{b.owner?.email}</p>
                                </td>
                                <td className="px-3 py-3">
                                    <Badge value={b.isExpired ? "CHURNED" : b.planStatus} label={b.isExpired ? "Vencido" : b.planStatus} />
                                </td>
                                <td className="px-3 py-3 text-[#8E8E93]">{dateBR(b.planExpiresAt)}</td>
                                <td className="px-3 py-3 text-xs text-[#8E8E93]">
                                    {b.appointments} agend.<br />
                                    {b.clients} clientes · {b.users} usuários
                                </td>
                                <td className="px-3 py-3">
                                    {b.affiliate ? (
                                        <>
                                            <p className="text-xs text-[#D49A62]">{b.affiliate.name}</p>
                                            <p className="font-mono text-[10px] text-[#5A5A5F]">{b.affiliate.code}</p>
                                        </>
                                    ) : (
                                        <span className="text-xs text-[#5A5A5F]">Orgânico</span>
                                    )}
                                </td>
                                <td className="px-3 py-3 text-[#8E8E93]">{dateBR(b.createdAt)}</td>
                                <td className="px-3 py-3">
                                    <Button variant="ghost" onClick={() => extend(b.id)} disabled={busy}>
                                        Estender
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>
        </>
    );
}
