"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AnalyticsHeader } from "@/components/admin/analytics/AnalyticsHeader";
import { BalanceSection } from "@/components/admin/analytics/BalanceSection";
import { InteractiveChart } from "@/components/admin/analytics/InteractiveChart";
import { ServicesRealized } from "@/components/admin/analytics/ServicesRealized";

const getPeriodLabel = (timeframe: string, offset: number) => {
    const date = new Date();
    if (timeframe === "ano") {
        date.setFullYear(date.getFullYear() + offset);
        return date.getFullYear().toString();
    }
    if (timeframe === "mês") {
        date.setMonth(date.getMonth() + offset);
        return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    }
    if (timeframe === "semana") {
        date.setDate(date.getDate() + (offset * 7));
        return "Semana Selecionada"; // Simplificado, use a lógica de data anterior se desejar
    }
    return "";
};

export default function FaturamentoPage() {
    const router = useRouter();
    const [activeTimeframe, setActiveTimeframe] = useState<"semana" | "mês" | "ano">("mês");
    const [periodOffset, setPeriodOffset] = useState(0);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/analytics/revenue?timeframe=${activeTimeframe}&offset=${periodOffset}`);
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("Erro ao carregar faturamento");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [activeTimeframe, periodOffset]);

    const handleTimeframeChange = (t: "semana" | "mês" | "ano") => {
        setActiveTimeframe(t);
        setPeriodOffset(0);
    };

    if (loading && !data) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Carregando...</div>;

    return (
        <main className="min-h-screen w-full bg-background max-w-md mx-auto flex flex-col font-sans relative overflow-x-hidden">
            <AnalyticsHeader
                onBack={() => router.back()}
                activeTimeframe={activeTimeframe}
                onSelectTimeframe={handleTimeframeChange}
                periodLabel={getPeriodLabel(activeTimeframe, periodOffset)}
                onPrevPeriod={() => setPeriodOffset(prev => prev - 1)}
                onNextPeriod={() => setPeriodOffset(prev => prev + 1)}
            />

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-20 space-y-10">
                {data && (
                    <>
                        <BalanceSection
                            total={data.balance.total}
                            comissao={data.balance.comissao}
                            bruto={data.balance.bruto}
                            atendimentos={data.balance.atendimentos}
                        />

                        <div key={`${activeTimeframe}-${periodOffset}`} className="animate-in fade-in duration-500">
                            <InteractiveChart data={data.chartData} />
                        </div>

                        <ServicesRealized services={data.services} />
                    </>
                )}
            </div>
        </main>
    );
}