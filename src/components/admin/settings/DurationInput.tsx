"use client";

import { Minus, Plus, Clock } from "lucide-react";

interface DurationInputProps {
    value: number; // Minutos
    onChange: (newValue: number) => void;
}

export const DurationInput = ({ value, onChange }: DurationInputProps) => {
    // Formata os minutos para exibição (ex: 90 -> 1h 30min)
    const formatDisplay = (min: number) => {
        const h = Math.floor(min / 60);
        const m = min % 60;
        if (h > 0) return `${h}h ${m > 0 ? `${m}min` : ""}`;
        return `${m} min`;
    };

    const increment = () => onChange(value + 15);
    const decrement = () => value > 15 && onChange(value - 15);

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-accent uppercase px-1 tracking-widest flex items-center gap-2">
                <Clock size={12} /> Duração Estimada
            </label>
            
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-[28px] h-20">
                <button
                    type="button"
                    onClick={decrement}
                    className="w-14 h-14 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all"
                >
                    <Minus size={20} />
                </button>

                <div className="flex-1 text-center">
                    <span className="text-2xl font-black text-white block leading-none">
                        {formatDisplay(value)}
                    </span>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-tighter">
                        Tempo de Cadeira
                    </span>
                </div>

                <button
                    type="button"
                    onClick={increment}
                    className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 hover:bg-accent/90 active:scale-90 transition-all"
                >
                    <Plus size={20} />
                </button>
            </div>
        </div>
    );
};