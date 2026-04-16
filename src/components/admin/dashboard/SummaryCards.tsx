"use client";

import { motion } from "framer-motion";

interface SummaryCardsProps {
  showValues: boolean;
  todayRevenue: string;
  todayCount: number;
  weekRevenue: string;
  weekCount: number;
}

export const SummaryCards = ({ 
  showValues, 
  todayRevenue, 
  todayCount, 
  weekRevenue, 
  weekCount 
}: SummaryCardsProps) => {
  return (
    <div className="flex gap-4 m-6">
      {/* CARD HOJE (ORANGE ACCENT) */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className="flex-1 bg-orange-600 rounded-[2.5rem] p-6 shadow-[0_20px_40px_rgba(249,115,22,0.15)] relative overflow-hidden will-change-transform"
      >
        <div className="relative z-10">
          <h3 className="text-white/70 font-black text-[10px] uppercase tracking-[0.2em]">Hoje</h3>
          
          <div className="flex items-center gap-1.5 text-white font-bold mt-1 text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className="tracking-tight">{showValues ? todayRevenue : "•••••"}</span>
          </div>

          <div className="text-6xl font-black leading-none mt-6 text-white tracking-tighter">
            {todayCount}
          </div>
        </div>

        {/* ÍCONE DE FUNDO DECORATIVO */}
        <div className="absolute -bottom-4 -right-4 text-white/10 rotate-12 pointer-events-none">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
          </svg>
        </div>
      </motion.div>

      {/* CARD SEMANA (DARK ZINC) */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 relative overflow-hidden will-change-transform"
      >
        <div className="relative z-10">
          <h3 className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em]">Semana</h3>

          <div className="flex items-center gap-1.5 text-zinc-400 font-bold mt-1 text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className="tracking-tight">{showValues ? weekRevenue : "•••••"}</span>
          </div>

          <div className="text-6xl font-black leading-none mt-6 text-white tracking-tighter">
            {weekCount}
          </div>
        </div>

        {/* ÍCONE DE FUNDO DECORATIVO */}
        <div className="absolute -bottom-4 -right-4 text-white/[0.02] -rotate-12 pointer-events-none">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};