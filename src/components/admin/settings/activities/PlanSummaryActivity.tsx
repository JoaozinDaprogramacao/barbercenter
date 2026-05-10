"use client";

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

export function PlanSummaryActivity({ onClose, onNext }: { onClose: () => void, onNext: (t: 'PIX'|'CARD') => void }) {
  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 flex flex-col bg-[#050505] overflow-hidden"
    >
      {/* Efeitos Artísticos Premium (Glows Acobreados) */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_top,rgba(184,115,51,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[400px] bg-[radial-gradient(circle_at_bottom,rgba(212,154,98,0.05),transparent_60%)] pointer-events-none" />

      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="w-10" />
        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#B87333]">Assinatura PRO</span>
        <button 
          onClick={onClose} 
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2] active:scale-90"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-[2rem] font-black leading-tight tracking-tighter text-[#F7EFE2] mb-8">
          Este é seu plano de <br/> 
          <span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent">assinatura atual</span>
        </h2>
        
        {/* Foguete com brilho em Cobre/Dourado */}
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
          className="relative w-48 h-48 mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-[#B87333]/20 blur-3xl" />
          <Image 
            src="/rocket.png" 
            alt="Foguete" 
            fill 
            className="object-contain drop-shadow-[0_15px_30px_rgba(184,115,51,0.4)] relative z-10" 
          />
        </motion.div>

        {/* Card de Preço - Glassmorphism Premium */}
        <div className="group relative mb-10 w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.10),transparent_40%)]" />
          
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-2">Apenas</p>
            <h3 className="text-[3rem] font-black tracking-tighter text-[#F7EFE2]">
              R$ 32<span className="text-[2rem]">,90</span>
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-[#D49A62] mt-1">por profissional</p>
            
            <div className="mt-6 inline-block rounded-full border border-white/10 bg-[#0A0A0A] px-5 py-2.5 text-[11px] font-black tracking-widest uppercase text-zinc-400 shadow-inner">
              Total <span className="text-[#F7EFE2]">R$ 32,90 / mês</span>
            </div>
          </div>
        </div>

        <p className="mb-12 max-w-xs text-[13px] font-medium leading-relaxed text-zinc-400">
          A assinatura fortalece nossa parceria, nos permitindo evoluir a ferramenta constantemente.
        </p>

        <div className="w-full max-w-sm space-y-3 mt-auto">
          {/* Botão PIX - Mantive um tom verde-água luxuoso para remeter ao PIX, mas que combina com o tema dark */}
          <button 
            onClick={() => onNext('PIX')} 
            className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-gradient-to-r from-[#00BFA6] to-[#00A382] py-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#050505] shadow-[0_10px_20px_rgba(0,163,130,0.2)] transition-all hover:brightness-110 active:scale-95"
          >
            Pagar com PIX
          </button>
          
          {/* Botão Cartão - Transparente/Glass com hover acobreado */}
          <button 
            onClick={() => onNext('CARD')} 
            className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.03] py-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#F7EFE2] backdrop-blur-md transition-all hover:border-[#B87333]/40 hover:bg-white/[0.06] hover:text-[#D49A62] active:scale-95"
          >
            Cartão de Crédito
          </button>
        </div>
      </div>
    </motion.div>
  );
}