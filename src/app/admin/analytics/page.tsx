"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
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
        const dayOfWeek = date.getDay();
        const start = new Date(date);
        start.setDate(date.getDate() - dayOfWeek);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        const startStr = start.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
        const endStr = end.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
        return `${startStr} a ${endStr}`;
    }
    return "";
};

const MOCK_DB = {
    semana: {
        balance: { total: 482.50, bruto: 804.16, comissao: "Com. 60%", atendimentos: 18 },
        chartData: [
            { label: "Seg", height: "15%", atendimentos: 1, bruto: "30,00", liquido: "18,00", np: "5,00" },
            { label: "Ter", height: "40%", atendimentos: 4, bruto: "120,00", liquido: "72,00", np: "15,00" },
            { label: "Qua", height: "30%", atendimentos: 3, bruto: "90,00", liquido: "54,00", np: "10,00" },
            { label: "Qui", height: "60%", atendimentos: 6, bruto: "180,00", liquido: "108,00", np: "20,00" },
            { label: "Sex", height: "90%", atendimentos: 9, bruto: "270,00", liquido: "162,00", np: "30,00" },
            { label: "Sáb", height: "100%", atendimentos: 12, bruto: "360,00", liquido: "216,00", np: "45,00" },
            { label: "Dom", height: "0%", atendimentos: 0, bruto: "0,00", liquido: "0,00", np: "0,00" },
        ],
        services: [{ name: "Corte", count: 12 }, { name: "Barba", count: 6 }],
    },
    mês: {
        balance: { total: 3420.00, bruto: 5700.00, comissao: "Com. 60%", atendimentos: 142 },
        chartData: [
            { label: "Sem 1", height: "60%", atendimentos: 32, bruto: "1.200,00", liquido: "720,00", np: "150,00" },
            { label: "Sem 2", height: "80%", atendimentos: 45, bruto: "1.800,00", liquido: "1.080,00", np: "200,00" },
            { label: "Sem 3", height: "50%", atendimentos: 28, bruto: "1.050,00", liquido: "630,00", np: "120,00" },
            { label: "Sem 4", height: "90%", atendimentos: 37, bruto: "1.650,00", liquido: "990,00", np: "180,00" },
        ],
        services: [{ name: "Corte", count: 98 }, { name: "Barba", count: 40 }, { name: "Degradê", count: 4 }],
    },
    ano: {
        balance: { total: 38500.00, bruto: 64166.66, comissao: "Com. 60%", atendimentos: 1540 },
        chartData: [
            { label: "Jan", height: "30%", atendimentos: 110, bruto: "4.500", liquido: "2.700", np: "400" },
            { label: "Fev", height: "40%", atendimentos: 130, bruto: "5.200", liquido: "3.120", np: "450" },
            { label: "Mar", height: "35%", atendimentos: 125, bruto: "5.000", liquido: "3.000", np: "420" },
            { label: "Abr", height: "45%", atendimentos: 160, bruto: "6.500", liquido: "3.900", np: "500" },
            { label: "Mai", height: "55%", atendimentos: 180, bruto: "7.200", liquido: "4.320", np: "600" },
            { label: "Jun", height: "65%", atendimentos: 200, bruto: "8.500", liquido: "5.100", np: "700" },
            { label: "Jul", height: "60%", atendimentos: 190, bruto: "7.800", liquido: "4.680", np: "650" },
            { label: "Ago", height: "70%", atendimentos: 220, bruto: "9.500", liquido: "5.700", np: "800" },
            { label: "Set", height: "65%", atendimentos: 210, bruto: "9.000", liquido: "5.400", np: "750" },
            { label: "Out", height: "75%", atendimentos: 230, bruto: "10.000", liquido: "6.000", np: "850" },
            { label: "Nov", height: "80%", atendimentos: 240, bruto: "10.500", liquido: "6.300", np: "900" },
            { label: "Dez", height: "100%", atendimentos: 280, bruto: "12.000", liquido: "7.200", np: "1.000" },
        ],
        services: [{ name: "Corte", count: 1040 }, { name: "Barba", count: 450 }, { name: "Combo", count: 50 }],
    }
};

export default function FaturamentoPage() {
    const router = useRouter();
    const [activeTimeframe, setActiveTimeframe] = useState<"semana" | "mês" | "ano">("mês");
    const [periodOffset, setPeriodOffset] = useState(0);

    const handleTimeframeChange = (t: "semana" | "mês" | "ano") => {
        setActiveTimeframe(t);
        setPeriodOffset(0);
    };

    const periodLabel = getPeriodLabel(activeTimeframe, periodOffset);

    const currentData = useMemo(() => {
        const baseData = MOCK_DB[activeTimeframe];
        const variance = 1 + (periodOffset * 0.15);

        return {
            balance: {
                ...baseData.balance,
                total: (baseData.balance.total * variance).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                bruto: (baseData.balance.bruto * Math.abs(variance)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            },
            chartData: baseData.chartData.map(item => {
                const h = parseInt(item.height);
                const newHeight = Math.max(10, Math.min(100, h * variance));
                return { ...item, height: `${newHeight}%` };
            }),
            services: baseData.services
        };
    }, [activeTimeframe, periodOffset]);

    return (
        <main className="min-h-screen w-full bg-background max-w-md mx-auto flex flex-col font-sans relative overflow-x-hidden">

            <AnalyticsHeader
                onBack={() => router.back()}
                activeTimeframe={activeTimeframe}
                onSelectTimeframe={handleTimeframeChange}
                periodLabel={periodLabel}
                onPrevPeriod={() => setPeriodOffset(prev => prev - 1)}
                onNextPeriod={() => setPeriodOffset(prev => prev + 1)}
            />

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                <BalanceSection
                    total={currentData.balance.total}
                    comissao={currentData.balance.comissao}
                    bruto={currentData.balance.bruto}
                    atendimentos={currentData.balance.atendimentos}
                />

                <div key={`${activeTimeframe}-${periodOffset}`}>
                    <InteractiveChart data={currentData.chartData} />
                </div>

                <ServicesRealized services={currentData.services} />
            </div>
        </main>
    );
}