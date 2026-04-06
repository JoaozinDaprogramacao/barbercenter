"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const MonthsFilter = ({ months, active, onSelect }: { months: string[], active: string, onSelect: (m: string) => void }) => (
    <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-6 -mx-6">
        {months.map((month) => (
            <button
                key={month}
                onClick={() => onSelect(month)}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${active === month
                        ? "bg-accent text-black"
                        : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
            >
                {month}
            </button>
        ))}
    </div>
);

const ServiceCard = ({ count, name }: { count: number, name: string }) => (
    <div className="min-w-[140px] bg-white/[0.03] border border-white/5 p-6 rounded-[24px] flex flex-col justify-between aspect-square">
        <span className="text-5xl font-black text-accent tracking-tighter">{count}</span>
        <span className="text-white/60 font-bold text-sm leading-tight">{name}</span>
    </div>
);

export default function FaturamentoPage() {
    const router = useRouter();
    const [activeMonth, setActiveMonth] = useState("ABR");
    const [selectedDay, setSelectedDay] = useState<number | null>(2);

    const months = ["DEZ 23", "JAN", "FEV", "MAR", "ABR"];

    const chartData = [
        { day: 1, height: "15%", atendimentos: 1, bruto: "30,00", liquido: "18,00", np: "5,00" },
        { day: 2, height: "50%", atendimentos: 5, bruto: "120,00", liquido: "72,00", np: "19,90" },
        { day: 3, height: "30%", atendimentos: 3, bruto: "90,00", liquido: "54,00", np: "15,00" },
        { day: 4, height: "25%", atendimentos: 2, bruto: "60,00", liquido: "36,00", np: "10,00" },
        { day: 5, height: "90%", atendimentos: 9, bruto: "270,00", liquido: "162,00", np: "45,00" },
        { day: 6, height: "40%", atendimentos: 4, bruto: "100,00", liquido: "60,00", np: "12,00" },
        { day: 7, height: "10%", atendimentos: 1, bruto: "20,00", liquido: "12,00", np: "3,00" },
        { day: 8, height: "15%", atendimentos: 1, bruto: "35,00", liquido: "21,00", np: "5,50" },
    ];

    const handleBarClick = (day: number) => {
        if (selectedDay === day) {
            setSelectedDay(null);
        } else {
            setSelectedDay(day);
        }
    };

    const services = [
        { name: "Corte", count: 44 },
        { name: "Barba", count: 18 },
        { name: "Corte degradê", count: 1 },
    ];

    return (
        <main className="min-h-screen w-full bg-background max-w-md mx-auto flex flex-col font-sans relative overflow-x-hidden">

            <header className="px-6 pt-12 pb-4 shrink-0">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center text-white/60 active:scale-95 transition-all mb-4"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                </button>
                <div>
                    <p className="text-white/40 text-sm font-medium mb-1">Analisar</p>
                    <h2 className="text-4xl font-black text-white tracking-tight leading-none mb-6">Faturamento</h2>
                </div>

                <MonthsFilter months={months} active={activeMonth} onSelect={setActiveMonth} />
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">

                <section className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Balanço Serviços</p>
                        <button className="flex items-center gap-1 text-[10px] font-black text-white uppercase tracking-widest">
                            Meu Balanço <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6" /></svg>
                        </button>
                    </div>

                    <h3 className="text-[2.75rem] font-black text-white leading-none tracking-tighter mb-2">
                        R$ 923,82
                    </h3>

                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            (Com. 60%) | Valor Bruto: R$ 1.539,70
                        </p>
                        <p className="text-sm font-bold text-white/60">
                            <span className="text-white">55</span> atendimentos
                        </p>
                    </div>
                </section>

                <section className="relative mt-12">
                    <div className="h-44 flex items-end justify-between gap-1 border-b border-white/10 pb-2 relative z-10">

                        <div className="absolute inset-0 flex justify-between px-2 -z-10">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="w-px h-full border-l border-dashed border-white/10" />
                            ))}
                        </div>

                        {chartData.map((data, index) => {
                            const isActive = selectedDay === data.day;
                            const isFirst = index === 0;
                            const isLast = index === chartData.length - 1;
                            const tooltipPosition = isFirst ? "left-0" : isLast ? "right-0" : "left-1/2 -translate-x-1/2";
                            const arrowPosition = isFirst ? "left-4" : isLast ? "right-4" : "left-1/2 -translate-x-1/2";

                            return (
                                <div
                                    key={data.day}
                                    className="h-full flex items-end justify-center flex-1 cursor-pointer group"
                                    onClick={() => handleBarClick(data.day)}
                                >
                                    <div className="relative w-full max-w-[28px] flex justify-center" style={{ height: data.height }}>

                                        {isActive && (
                                            <div className={`absolute bottom-full mb-3 z-30 bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black animate-in zoom-in-95 duration-200 pointer-events-none w-max min-w-[140px] ${tooltipPosition}`}>
                                                <p className="text-accent font-black text-sm mb-2">Dia {data.day}</p>
                                                <div className="space-y-1 text-[11px] font-bold">
                                                    <p className="text-white">{data.atendimentos} Atendimento(s)</p>
                                                    <p className="text-white">Bruto: R$ {data.bruto}</p>
                                                    <p className="text-green-500">Líquido: R$ {data.liquido}</p>
                                                    <p className="text-green-500">N/P: R$ {data.np}</p>
                                                </div>
                                                <div className={`absolute -bottom-2 w-4 h-4 bg-[#0a0a0a] border-b border-r border-white/10 rotate-45 ${arrowPosition}`} />
                                            </div>
                                        )}

                                        <div
                                            className={`w-full h-full rounded-t-lg transition-all duration-300 ease-out ${isActive
                                                    ? 'bg-accent shadow-[0_0_15px_rgba(197,139,109,0.3)]'
                                                    : 'bg-white/20 group-hover:bg-white/30'
                                                }`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-between mt-3 px-2">
                        {chartData.map((data) => (
                            <span
                                key={`label-${data.day}`}
                                onClick={() => handleBarClick(data.day)}
                                className={`text-xs font-bold flex-1 text-center cursor-pointer transition-colors ${selectedDay === data.day ? 'text-accent' : 'text-white/60'
                                    }`}
                            >
                                {data.day}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 mt-6 opacity-40">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">
                            Arraste para o lado para ver mais
                        </p>
                    </div>
                </section>

                <section className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Filtro:</span>
                        <button className="px-4 py-2 rounded-xl border border-dashed border-white/20 text-white/60 text-[10px] font-black uppercase tracking-widest hover:border-white/40 transition-colors">
                            DATA
                        </button>
                    </div>
                </section>

                <section className="space-y-4">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Serviços Realizados</p>

                    <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-4">
                        {services.map(service => (
                            <ServiceCard key={service.name} count={service.count} name={service.name} />
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}