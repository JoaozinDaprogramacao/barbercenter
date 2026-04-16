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

  const increment = () => onChange(value + 15);
  const decrement = () => value > 15 && onChange(value - 15);

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-orange-600 uppercase px-1 tracking-[0.2em] flex items-center gap-2">
        <Clock size={12} strokeWidth={3} /> Duração Estimada
      </label>
      
      <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2.5 rounded-[2.5rem] h-24 shadow-2xl">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={decrement}
          className="w-16 h-16 rounded-3xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
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
          className="w-16 h-16 rounded-3xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20 hover:bg-orange-500 transition-colors"
        >
          <Plus size={24} strokeWidth={3} />
        </motion.button>
      </div>
    </div>
  );
};