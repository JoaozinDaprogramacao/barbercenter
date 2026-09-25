"use client";

import { useEffect, useState } from "react";
import {
    Card,
    Empty,
    PageTitle,
    Spinner,
    Table,
    dateTimeBR,
    inputClass,
} from "@/components/console/ui";

type Log = {
    id: string; actorEmail: string; action: string;
    targetType: string | null; targetId: string | null;
    metadata: unknown; ip: string | null; createdAt: string;
    platformUser: { name: string } | null;
};

// Login falho em vermelho, ações que mexem em dinheiro em cobre.
function actionTone(action: string) {
    if (action.includes("FAILED")) return "text-[#F87171]";
    if (action.startsWith("COMMISSION") || action.startsWith("PAYOUT")) return "text-[#D49A62]";
    return "text-[#9CA3AF]";
}

export default function AuditoriaPage() {
    const [logs, setLogs] = useState<Log[] | null>(null);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const timer = setTimeout(async () => {
            const params = new URLSearchParams();
            if (filter) params.set("action", filter);

            const res = await fetch(`/api/console/audit?${params}`);
            const data = await res.json();
            setLogs(data.logs ?? []);
            setTotal(data.total ?? 0);
        }, filter ? 300 : 0);

        return () => clearTimeout(timer);
    }, [filter]);

    return (
        <>
            <PageTitle
                title="Auditoria"
                subtitle={`${total} eventos. Toda ação que muda plano, comissão ou repasse passa por aqui.`}
            />

            <div className="mb-4 flex justify-end">
                <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filtrar por ação (ex: PAYOUT, LOGIN_FAILED)"
                    className={`${inputClass} max-w-xs`}
                />
            </div>

            <Card>
                {!logs ? (
                    <Spinner />
                ) : logs.length === 0 ? (
                    <Empty>Nenhum evento registrado.</Empty>
                ) : (
                    <Table head={["Quando", "Quem", "Ação", "Alvo", "Detalhes", "IP"]}>
                        {logs.map((log) => (
                            <tr key={log.id} className="border-b border-white/5 last:border-0 align-top">
                                <td className="whitespace-nowrap px-3 py-3 text-xs text-[#8E8E93]">
                                    {dateTimeBR(log.createdAt)}
                                </td>
                                <td className="px-3 py-3">
                                    <p className="text-xs text-white">{log.platformUser?.name ?? "—"}</p>
                                    <p className="text-[10px] text-[#5A5A5F]">{log.actorEmail}</p>
                                </td>
                                <td className={`px-3 py-3 font-mono text-xs ${actionTone(log.action)}`}>
                                    {log.action}
                                </td>
                                <td className="px-3 py-3 text-xs text-[#8E8E93]">
                                    {log.targetType ?? "—"}
                                    {log.targetId && (
                                        <span className="block font-mono text-[10px] text-[#5A5A5F]">
                                            {log.targetId.slice(0, 8)}
                                        </span>
                                    )}
                                </td>
                                <td className="max-w-xs px-3 py-3">
                                    {log.metadata ? (
                                        <pre className="overflow-x-auto whitespace-pre-wrap break-all text-[10px] text-[#5A5A5F]">
                                            {JSON.stringify(log.metadata)}
                                        </pre>
                                    ) : (
                                        <span className="text-xs text-[#5A5A5F]">—</span>
                                    )}
                                </td>
                                <td className="px-3 py-3 font-mono text-[10px] text-[#5A5A5F]">{log.ip ?? "—"}</td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>
        </>
    );
}
