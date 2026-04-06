"use client";

import { useState, useRef, useEffect } from "react";

interface ChartData {
    label: string;
    height: string;
    atendimentos: number;
    bruto: string;
    liquido: string;
    np: string;
}

export const InteractiveChart = ({ data }: { data: ChartData[] }) => {
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedLabel(null);
        if (scrollRef.current && data.length > 7) {
            setTimeout(() => {
                if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
            }, 50);
        }
    }, [data]);

    const handleBarClick = (label: string) => {
        setSelectedLabel(selectedLabel === label ? null : label);
    };

    const isScrollable = data.length > 7;
    const innerWidthClass = isScrollable ? "min-w-[600px]" : "w-full";

    return (
        <section className="relative z-10 mt-8">

            {/* A MÁGICA ACONTECE AQUI:
        pt-[150px] expande a caixa para não cortar o tooltip.
        -mt-[150px] anula o espaço para não empurrar o resto do app.
        pointer-events-none permite que cliques passem por essa área fantasma.
      */}
            <div
                ref={scrollRef}
                className="overflow-x-auto scroll-behavior-smooth no-scrollbar -mx-6 px-6 pb-4 pt-[150px] -mt-[150px] pointer-events-none"
            >

                {/* Adicionamos pointer-events-auto aqui para podermos clicar nas barras */}
                <div className={`flex items-end justify-between gap-2 border-b border-white/10 pb-2 relative z-10 ${innerWidthClass} h-40 pointer-events-auto`}>
                    <div className="absolute inset-0 flex justify-between px-2 -z-10 h-40">
                        {[...Array(isScrollable ? 12 : 7)].map((_, i) => (
                            <div key={i} className="w-px h-full border-l border-dashed border-white/10" />
                        ))}
                    </div>

                    {data.map((item, index) => {
                        const isActive = selectedLabel === item.label;
                        const isFirst = index < 2;
                        const isLast = index > data.length - 3;
                        const tooltipPosition = isFirst ? "left-0" : isLast ? "right-0" : "left-1/2 -translate-x-1/2";
                        const arrowPosition = isFirst ? "left-4" : isLast ? "right-4" : "left-1/2 -translate-x-1/2";

                        return (
                            <div key={item.label} className="h-full flex items-end justify-center flex-1 cursor-pointer group" onClick={() => handleBarClick(item.label)}>
                                <div className="relative w-full max-w-[28px] flex justify-center" style={{ height: item.height }}>

                                    {/* TOOLTIP */}
                                    {isActive && (
                                        <div className={`absolute bottom-full mb-3 z-30 bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black animate-in zoom-in-95 duration-200 w-max min-w-[140px] ${tooltipPosition}`}>
                                            <p className="text-accent font-black text-sm mb-2">{item.label}</p>
                                            <div className="space-y-1 text-[11px] font-bold">
                                                <p className="text-white">{item.atendimentos} Atendimentos</p>
                                                <p className="text-white">Bruto: R$ {item.bruto}</p>
                                                <p className="text-green-500">Líquido: R$ {item.liquido}</p>
                                                <p className="text-green-500">N/P: R$ {item.np}</p>
                                            </div>
                                            <div className={`absolute -bottom-2 w-4 h-4 bg-[#0a0a0a] border-b border-r border-white/10 rotate-45 ${arrowPosition}`} />
                                        </div>
                                    )}

                                    {/* BARRA */}
                                    <div className={`w-full h-full rounded-t-lg transition-all duration-300 ease-out ${isActive ? 'bg-accent shadow-[0_0_15px_rgba(197,139,109,0.3)]' : 'bg-white/20 group-hover:bg-white/30'}`} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Rótulos do Eixo X - Também com pointer-events-auto */}
                <div className={`flex justify-between mt-3 px-1 ${innerWidthClass} pointer-events-auto`}>
                    {data.map((item) => (
                        <span key={`label-${item.label}`} onClick={() => handleBarClick(item.label)} className={`text-[10px] font-black uppercase flex-1 text-center cursor-pointer transition-colors ${selectedLabel === item.label ? 'text-accent' : 'text-white/40'}`}>
                            {item.label}
                        </span>
                    ))}
                </div>
            </div>

            {isScrollable && (
                <div className="flex items-center gap-2 mt-4 opacity-40">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">Arraste para o lado para ver mais</p>
                </div>
            )}
        </section>
    );
};