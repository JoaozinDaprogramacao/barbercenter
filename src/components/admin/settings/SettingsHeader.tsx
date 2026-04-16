"use client";

import { motion } from "framer-motion";

interface SettingsHeaderProps {
  onBack: () => void;
}

export const SettingsHeader = ({ onBack }: SettingsHeaderProps) => (
  <header className="px-6 pt-12 pb-6 flex items-center justify-between shrink-0">
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onBack}
      className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white transition-all will-change-transform"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </motion.button>
    
    <button className="bg-zinc-900/50 text-zinc-500 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-zinc-800 transition-all active:opacity-50">
      Limpar Cache
    </button>
  </header>
);