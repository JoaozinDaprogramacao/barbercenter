"use client";

import { motion } from "framer-motion";

interface BalanceSectionProps {
  total: string;
  bruto: string;
  comissao: string;
  atendimentos: number;
}

export const BalanceSection = ({ total, bruto, comissao, atendimentos }: BalanceSectionProps) => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6"
    >
      <div className="flex justify-between items-center mb-4">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
          Balanço de Serviços
        </p>
        
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:text-[#F7EFE2] transition-colors"
        >
          Meu Saldo 
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-[#B87333]">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </motion.button>
      </div>

      <div className="mb-4">
        <motion.h3 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-5xl md:text-6xl font-black text-[#F7EFE2] leading-none tracking-tighter will-change-transform"
        >
          <span className="text-xl align-top mr-1 text-zinc-600">R$</span>
          {total}
        </motion.h3>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">Bruto:</span>
            <span className="text-xs font-bold text-zinc-200">R$ {bruto}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#B87333]/10 border border-[#B87333]/20 rounded-xl">
            <span className="text-[10px] font-black text-[#B87333]/70 uppercase tracking-tighter">Comissão:</span>
            <span className="text-xs font-bold text-[#C88A52]">{comissao}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-1">
          <div className="w-1.5 h-1.5 bg-[#C88A52] rounded-full animate-pulse shadow-[0_0_8px_rgba(200,138,82,0.5)]" />
          <p className="text-sm font-bold text-zinc-400">
            <span className="text-[#F7EFE2]">{atendimentos}</span> atendimentos realizados no período
          </p>
        </div>
      </div>
    </motion.section>
  );
};