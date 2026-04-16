"use client";

import { motion } from "framer-motion";

interface DashboardHeaderProps {
  showValues: boolean;
  onToggleValues: () => void;
  userName: string;
  onOpenMenu: () => void;
  onOpenSchedule: () => void;
}

export const DashboardHeader = ({
  showValues,
  onToggleValues,
  userName,
  onOpenMenu,
  onOpenSchedule,
}: DashboardHeaderProps) => {
  return (
    <header className="px-6 pt-12 pb-6 flex items-start justify-between shrink-0 bg-transparent">
      {/* Esquerda: Saudação */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }} 
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col"
      >
        <h1 className="text-3xl font-black tracking-tighter text-white">
          Olá, <span className="text-orange-600">{userName}</span>
        </h1>

        <button
          onClick={onOpenSchedule}
          className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 mt-1 hover:text-white transition-colors active:scale-95 will-change-transform"
        >
          Sua Agenda
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </motion.div>

      {/* Direita: Ações */}
      <div className="flex gap-2.5">
        {/* Toggle de Visibilidade */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleValues}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 border will-change-transform
            ${showValues 
              ? "bg-zinc-900 border-zinc-800 text-zinc-400" 
              : "bg-orange-600 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.2)]"
            }`}
        >
          {showValues ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" x2="22" y1="2" y2="22" />
            </svg>
          )}
        </motion.button>

        {/* Menu Hamburguer */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenMenu}
          className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all will-change-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </motion.button>
      </div>
    </header>
  );
};