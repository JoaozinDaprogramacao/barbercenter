"use client";

import { motion } from "framer-motion";

interface AnalyticsHeaderProps {
  onBack: () => void;
  activeTimeframe: "semana" | "mês" | "ano";
  onSelectTimeframe: (timeframe: "semana" | "mês" | "ano") => void;
  periodLabel: string;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
}

export const AnalyticsHeader = ({
  onBack,
  activeTimeframe,
  onSelectTimeframe,
  periodLabel,
  onPrevPeriod,
  onNextPeriod,
}: AnalyticsHeaderProps) => (
  <header className="px-6 pt-12 pb-6 shrink-0 bg-transparent relative z-20">
    {/* Botão de Voltar Otimizado */}
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onBack}
      className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-colors mb-6 will-change-transform"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </motion.button>

    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="text-orange-600/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Analisar</p>
      <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-8">Faturamento</h2>
    </motion.div>

    {/* Seletor de Timeframe (Segmented Control com Slide) */}
    <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 mb-6 relative">
      {(["semana", "mês", "ano"] as const).map((t) => {
        const isActive = activeTimeframe === t;
        return (
          <button
            key={t}
            onClick={() => onSelectTimeframe(t)}
            className={`flex-1 relative py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-colors duration-300 z-10 ${
              isActive ? "text-white" : "text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {t}
            {isActive && (
              <motion.div
                layoutId="activeTimeframe"
                className="absolute inset-0 bg-orange-600 rounded-xl shadow-[0_5px_15px_rgba(249,115,22,0.3)] -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>

    {/* Navegador de Período */}
    <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 rounded-[1.5rem] p-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onPrevPeriod}
        className="w-11 h-11 flex items-center justify-center text-zinc-500 hover:text-white bg-zinc-800 rounded-xl transition-all will-change-transform"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </motion.button>

      <div className="flex flex-col items-center">
        <span className="text-[11px] font-black uppercase tracking-tighter text-white">
          {periodLabel}
        </span>
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onNextPeriod}
        className="w-11 h-11 flex items-center justify-center text-zinc-500 hover:text-white bg-zinc-800 rounded-xl transition-all will-change-transform"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </motion.button>
    </div>
  </header>
);