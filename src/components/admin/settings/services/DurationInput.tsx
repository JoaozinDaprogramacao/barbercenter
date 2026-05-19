"use client";

import { Minus, Plus, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface DurationInputProps {
  value: number;
  onChange: (newValue: number) => void;
}

export const DurationInput = ({ value, onChange }: DurationInputProps) => {
  const formatDisplay = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h > 0) return `${h}h ${m > 0 ? `${m}min` : ""}`;
    return `${m} min`;
  };

  // Alterado para incrementar/decrementar de 1 em 1 minuto
  const increment = () => onChange(value + 1);
  const decrement = () => value > 1 && onChange(value - 1);

  // Atalhos rápidos para evitar centenas de cliques
  const presets = [
    { label: "15m", value: 15 },
    { label: "30m", value: 30 },
    { label: "1h", value: 60 },
    { label: "2h", value: 120 },
    { label: "5h", value: 300 },
  ];

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-[#B87333] uppercase px-1 tracking-[0.2em] flex items-center gap-2">
        <Clock size={12} strokeWidth={3} /> Duração Estimada
      </label>
      
      <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2.5 rounded-[2.5rem] h-24 shadow-2xl">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={decrement}
          className="w-16 h-16 rounded-3xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0"
        >
          <Minus size={24} strokeWidth={3} />
        </motion.button>

        <div className="flex-1 text-center">
          <span className="text-3xl font-black text-white block leading-none tracking-tighter">
            {formatDisplay(value)}
          </span>
          <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1 block">
            Tempo de Cadeira
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={increment}
          className="w-16 h-16 rounded-3xl bg-[#B87333] flex items-center justify-center text-[#F7EFE2] shadow-lg shadow-[#B87333]/20 hover:bg-[#C88A52] transition-colors shrink-0"
        >
          <Plus size={24} strokeWidth={3} />
        </motion.button>
      </div>

      {/* Botões de atalho rápido */}
      <div className="flex flex-wrap gap-2 px-1">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange(preset.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              value === preset.value
                ? "bg-[#B87333] text-[#F7EFE2]"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};