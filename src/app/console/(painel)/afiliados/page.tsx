"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Plus, X } from "lucide-react";
import {
    Badge,
    Button,
    Card,
    Empty,
    Field,
    PageTitle,
    Spinner,
    Table,
    brl,
    dateBR,
    inputClass,
} from "@/components/console/ui";
import { AFFILIATE_STATUS_LABEL, normalizeAffiliateCode } from "@/lib/platform/constants";

type Affiliate = {
    id: string; code: string; link: string; name: string; email: string;
    phone: string | null; instagram: string | null; pixKey: string | null;
    commissionPercent: number; status: string; createdAt: string;
    clicks: number; signups: number; activeReferrals: number;
    commissionPending: number; commissionApproved: number; commissionPaid: number;
};

const FILTERS = [
    { value: "", label: "Todos" },
    { value: "ACTIVE", label: "Ativos" },
    { value: "PENDING", label: "Pendentes" },
    { value: "PAUSED", label: "Pausados" },
    { value: "BANNED", label: "Banidos" },
];

function CopyLink({ link }: { link: string }) {
    const [copied, setCopied] = useState(false);

    return (
        <button
            onClick={async () => {
                await navigator.clipboard.writeText(link);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
            }}
            className="flex items-center gap-1.5 text-xs text-[#9CA3AF] transition-colors hover:text-[#D49A62]"
            title={link}
        >
            {copied ? <Check size={13} className="text-[#82D173]" /> : <Copy size={13} />}
            {copied ? "Copiado" : "Copiar link"}
        </button>
    );
}

function NewAffiliateForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
    const [form, setForm] = useState({
        name: "", email: "", code: "", phone: "", instagram: "",
        pixKey: "", pixKeyType: "CPF", commissionPercent: 50, notes: "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const res = await fetch("/api/console/affiliates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        setSaving(false);

        if (!res.ok) return setError(data.error ?? "Erro ao criar embaixador");
        onDone();
    };

    const set = (key: string, value: string | number) => setForm((f) => ({ ...f, [key]: value }));

    return (
        <Card
            title="Novo embaixador"
            action={
                <button onClick={onCancel} className="text-[#8E8E93] hover:text-white">
                    <X size={18} />
                </button>
            }
        >
            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                <Field label="Nome *">
                    <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
                </Field>

                <Field label="E-mail *">
                    <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
                </Field>

                <Field label="Código do link * (3 a 24, A-Z 0-9 -)">
                    <input
                        required
                        value={form.code}
                        onChange={(e) => set("code", normalizeAffiliateCode(e.target.value))}
                        placeholder="JOAOBARBER"
                        className={inputClass}
                    />
                </Field>

                <Field label="Comissão (%)">
                    <input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={form.commissionPercent}
                        onChange={(e) => set("commissionPercent", Number(e.target.value))}
                        className={inputClass}
                    />
                </Field>

                <Field label="WhatsApp">
                    <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} />
                </Field>

                <Field label="Instagram">
                    <input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@barbeiro" className={inputClass} />
                </Field>

                <Field label="Chave PIX">
                    <input value={form.pixKey} onChange={(e) => set("pixKey", e.target.value)} className={inputClass} />
                </Field>

                <Field label="Tipo da chave">
                    <select value={form.pixKeyType} onChange={(e) => set("pixKeyType", e.target.value)} className={inputClass}>
                        <option value="CPF">CPF</option>
                        <option value="EMAIL">E-mail</option>
                        <option value="PHONE">Telefone</option>
                        <option value="RANDOM">Aleatória</option>
                    </select>
                </Field>

                <div className="md:col-span-2">
                    <Field label="Observações">
                        <textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={inputClass} />
                    </Field>
                </div>

                {error && (
                    <p className="rounded-xl border border-[#F87171]/30 bg-[#F87171]/10 px-3 py-2 text-xs text-[#F87171] md:col-span-2">
                        {error}
                    </p>
                )}

                <p className="text-xs text-[#8E8E93] md:col-span-2">
                    Nasce como <strong className="text-[#D49A62]">pendente</strong>: o link só passa a
                    contar cliques e gerar comissão depois que você ativar.
                </p>

                <div className="flex gap-2 md:col-span-2">
                    <Button type="submit" disabled={saving}>{saving ? "Salvando…" : "Criar embaixador"}</Button>
                    <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
                </div>
            </form>
        </Card>
    );
}

export default function AfiliadosPage() {
    const [affiliates, setAffiliates] = useState<Affiliate[] | null>(null);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [creating, setCreating] = useState(false);

    const load = useCallback(async () => {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (search) params.set("q", search);

        const res = await fetch(`/api/console/affiliates?${params}`);
        const data = await res.json();
        setAffiliates(data.affiliates ?? []);
    }, [status, search]);

    useEffect(() => {
        const timer = setTimeout(load, search ? 300 : 0);
        return () => clearTimeout(timer);
    }, [load, search]);

    const changeStatus = async (id: string, next: string) => {
        await fetch(`/api/console/affiliates/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: next }),
        });
        load();
    };

    return (
        <>
            <PageTitle
                title="Embaixadores"
                subtitle="Barbeiros referência que divulgam o BarberCenter e ficam com 50% recorrente."
                action={
                    !creating && (
                        <Button onClick={() => setCreating(true)}>
                            <span className="flex items-center gap-2"><Plus size={14} /> Novo</span>
                        </Button>
                    )
                }
            />

            {creating && (
                <div className="mb-6">
                    <NewAffiliateForm
                        onDone={() => { setCreating(false); load(); }}
                        onCancel={() => setCreating(false)}
                    />
                </div>
            )}

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
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nome, e-mail ou código"
                    className={`${inputClass} ml-auto max-w-xs`}
                />
            </div>

            <Card>
                {!affiliates ? (
                    <Spinner />
                ) : affiliates.length === 0 ? (
                    <Empty>Nenhum embaixador aqui ainda.</Empty>
                ) : (
                    <Table head={["Embaixador", "Link", "Cliques", "Cadastros", "Pagando", "A pagar", "Repassado", "Status", ""]}>
                        {affiliates.map((a) => (
                            <tr key={a.id} className="border-b border-white/5 last:border-0">
                                <td className="px-3 py-3">
                                    <p className="font-semibold text-white">{a.name}</p>
                                    <p className="text-xs text-[#8E8E93]">{a.email}</p>
                                    <p className="mt-0.5 text-[10px] uppercase tracking-widest text-[#5A5A5F]">
                                        {a.commissionPercent}% · desde {dateBR(a.createdAt)}
                                    </p>
                                </td>
                                <td className="px-3 py-3">
                                    <p className="font-mono text-xs text-[#D49A62]">{a.code}</p>
                                    <CopyLink link={a.link} />
                                </td>
                                <td className="px-3 py-3 text-[#9CA3AF]">{a.clicks}</td>
                                <td className="px-3 py-3 text-[#9CA3AF]">{a.signups}</td>
                                <td className="px-3 py-3 font-semibold text-[#82D173]">{a.activeReferrals}</td>
                                <td className="px-3 py-3 font-semibold text-white">
                                    {brl(a.commissionPending + a.commissionApproved)}
                                </td>
                                <td className="px-3 py-3 text-[#8E8E93]">{brl(a.commissionPaid)}</td>
                                <td className="px-3 py-3">
                                    <Badge value={a.status} label={AFFILIATE_STATUS_LABEL[a.status]} />
                                </td>
                                <td className="px-3 py-3">
                                    {a.status === "ACTIVE" ? (
                                        <Button variant="ghost" onClick={() => changeStatus(a.id, "PAUSED")}>Pausar</Button>
                                    ) : a.status === "BANNED" ? null : (
                                        <Button onClick={() => changeStatus(a.id, "ACTIVE")}>Ativar</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>
        </>
    );
}
