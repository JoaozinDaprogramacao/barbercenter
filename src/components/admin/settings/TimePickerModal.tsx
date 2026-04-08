"use client";

import { useEffect, useRef, useState } from "react";

type WheelColumnProps = {
    options: string[];
    selected: string;
    onSelect: (val: string) => void;
};

type TimePickerModalProps = {
    isOpen: boolean;
    onClose: () => void;
    currentValue: string;
    onSelect: (value: string) => void;
    label: string;
};

const ITEM_HEIGHT = 52;
const VISIBLE_ROWS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;

const WheelColumn = ({ options, selected, onSelect }: WheelColumnProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!scrollRef.current) return;
        const index = Math.max(0, options.indexOf(selected));
        scrollRef.current.scrollTop = index * ITEM_HEIGHT;
    }, [options, selected]);

    const snapToNearest = () => {
        if (!scrollRef.current) return;

        const index = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT);
        const safeIndex = Math.max(0, Math.min(index, options.length - 1));
        const nextValue = options[safeIndex];

        scrollRef.current.scrollTo({
            top: safeIndex * ITEM_HEIGHT,
            behavior: "smooth",
        });

        if (nextValue !== selected) {
            onSelect(nextValue);
        }
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const index = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT);
        const safeIndex = Math.max(0, Math.min(index, options.length - 1));
        const nextValue = options[safeIndex];

        if (nextValue && nextValue !== selected) {
            onSelect(nextValue);
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            snapToNearest();
        }, 90);
    };

    return (
        <div className="relative flex-1">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="no-scrollbar overflow-y-auto snap-y snap-mandatory"
                style={{
                    height: PICKER_HEIGHT,
                    paddingTop: ITEM_HEIGHT * 2,
                    paddingBottom: ITEM_HEIGHT * 2,
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                {options.map((option) => {
                    const isActive = option === selected;

                    return (
                        <div
                            key={option}
                            className="snap-center flex items-center justify-center transition-all duration-200 select-none"
                            style={{ height: ITEM_HEIGHT }}
                        >
                            <span
                                className={[
                                    "tabular-nums font-black tracking-tight transition-all duration-200",
                                    isActive
                                        ? "text-white scale-110"
                                        : "text-white/30 scale-90 blur-[0.5px]"
                                ].join(" ")}
                            >
                                {option}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const TimePickerModal = ({
    isOpen,
    onClose,
    currentValue,
    onSelect,
    label,
}: TimePickerModalProps) => {
    const hours = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0")
    );
    const minutes = ["00", "15", "30", "45"];

    const [h, setH] = useState(currentValue?.split(":")[0] || "09");
    const [m, setM] = useState(currentValue?.split(":")[1] || "00");

    useEffect(() => {
        setH(currentValue?.split(":")[0] || "09");
        setM(currentValue?.split(":")[1] || "00");
    }, [currentValue]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
            <button
                type="button"
                aria-label="Fechar modal"
                onClick={onClose}
                className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />

            <div className="relative w-full max-w-md rounded-t-[50px] border-t border-white/10 bg-background pt-2 pb-10 shadow-[0_-20px_100px_rgba(0,0,0,1)] animate-in slide-in-from-bottom duration-500">
                <div className="w-14 h-1.5 bg-white/10 rounded-full mx-auto mb-10 mt-2" />

                {/* --- HDISPLAY ULTRA: SEM LIMITES --- */}
                {/* --- HDISPLAY: EQUILIBRADO E ELEGANTE --- */}
                <div className="relative mb-8 w-full">
                    <div className="flex flex-col items-center justify-center w-full">
                        {/* Label sutil em cima */}
                        <p className="text-accent/50 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                            {label}
                        </p>

                        <div className="relative flex items-center justify-center">
                            {/* Glow reduzido para acompanhar o novo tamanho */}
                            <div className="absolute inset-0 bg-accent/5 blur-[40px] rounded-full" />

                            <div className="relative flex items-center justify-center tabular-nums">
                                {/* HORA */}
                                <span className="text-7xl md:text-8xl font-[1000] text-white tracking-tight drop-shadow-sm">
                                    {h}
                                </span>

                                {/* SEPARADOR */}
                                <span className="text-5xl md:text-6xl font-black text-accent/30 mx-2 animate-pulse select-none">
                                    :
                                </span>

                                {/* MINUTO */}
                                <span className="text-7xl md:text-8xl font-[1000] text-white tracking-tight drop-shadow-sm">
                                    {m}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SELETOR (WHEEL) - SLIM PARA DAR DESTAQUE AO DISPLAY */}
                <div className="px-8 mb-10">
                    <div className="relative rounded-[32px] border border-white/5 bg-white/[0.02] overflow-hidden shadow-inner">
                        {/* Lente de Foco Central */}
                        <div
                            className="absolute left-4 right-4 top-1/2 -translate-y-1/2 rounded-[22px] bg-white/[0.05] border border-white/10 pointer-events-none z-20"
                            style={{ height: ITEM_HEIGHT }}
                        />

                        {/* Sombreamento das bordas do Wheel */}
                        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-10" />
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />

                        <div className="relative z-0 flex items-center px-6">
                            <WheelColumn options={hours} selected={h} onSelect={setH} />
                            <div className="w-[1px] h-14 bg-white/10" />
                            <WheelColumn options={minutes} selected={m} onSelect={setM} />
                        </div>
                    </div>
                </div>

                {/* BOTÕES DE AÇÃO - ELEGÂNCIA MINIMALISTA */}
                <div className="grid grid-cols-2 gap-4 px-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="py-5 rounded-[24px] bg-white/5 text-white/40 font-black uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-all"
                    >
                        Voltar
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onSelect(`${h}:${m}`);
                            onClose();
                        }}
                        className="py-5 rounded-[24px] bg-accent text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_20px_40px_rgba(212,163,115,0.25)] active:scale-95 transition-all"
                    >
                        Confirmar
                    </button>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        .no-scrollbar::-webkit-scrollbar { display: none; }
                        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    `,
                }}
            />
        </div>
    );
};