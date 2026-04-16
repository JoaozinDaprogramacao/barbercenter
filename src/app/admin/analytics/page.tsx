"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        return "Semana Atual";
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

    return (
        <main className="min-h-screen w-full bg-black max-w-md mx-auto flex flex-col font-sans relative overflow-x-hidden border-x border-zinc-900">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-20 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full" />
            </div>

            {/* Movi o Header para dentro do container de scroll.
               Removi o 'flex-1' da div de baixo e deixei o container pai controlar o scroll 
            */}
            <div className="h-screen overflow-y-auto no-scrollbar z-10">

                {/* Agora o Header rola junto com o conteúdo */}
                <AnalyticsHeader
                    onBack={() => router.back()}
                    activeTimeframe={activeTimeframe}
                    onSelectTimeframe={handleTimeframeChange}
                    periodLabel={getPeriodLabel(activeTimeframe, periodOffset)}
                    onPrevPeriod={() => setPeriodOffset(prev => prev - 1)}
                    onNextPeriod={() => setPeriodOffset(prev => prev + 1)}
                />

                <div className="px-6 pb-24">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20"
                            >
                                <div className="w-10 h-10 border-2 border-orange-600/20 border-t-orange-600 rounded-full animate-spin" />
                                <p className="mt-4 text-zinc-500 text-xs font-black uppercase tracking-[0.2em]">Sincronizando Dados</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-10 will-change-transform"
                            >
                                {data && (
                                    <>
                                        <BalanceSection
                                            total={data.balance.total}
                                            comissao={data.balance.comissao}
                                            bruto={data.balance.bruto}
                                            atendimentos={data.balance.atendimentos}
                                        />

                                        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-[2.5rem] shadow-2xl">
                                            <div className="px-4 pt-2 mb-6">
                                                <h3 className="text-white font-black uppercase text-[11px] tracking-[0.2em] opacity-50">Desempenho Financeiro</h3>
                                            </div>
                                            <InteractiveChart data={data.chartData} />
                                        </div>

                                        <ServicesRealized services={data.services} />
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Blur Effect */}
            <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </main>
    );
}