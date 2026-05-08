"use client";
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

export function PlanSummaryActivity({ onClose, onNext }: { onClose: () => void, onNext: (t: 'PIX'|'CARD') => void }) {
  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 flex flex-col bg-[#05150e] overflow-hidden"
    >
      {/* Efeitos Artísticos */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#05150e] to-[#05150e] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/black-paper.png")` }}
      />

      <header className="relative z-10 p-6 flex justify-between items-center border-b border-emerald-900/30 bg-black/20 backdrop-blur-md">
        <div className="w-10" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">Assinatura PRO</span>
        <button onClick={onClose} className="w-10 flex justify-end text-emerald-100/50 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-black text-white leading-tight mb-8 tracking-tighter italic">
          Este é seu plano de <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-200">assinatura atual</span>
        </h2>
        
        {/* Substituí a sombra laranja do foguete por um brilho esmeralda/dourado */}
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} className="relative w-52 h-52 mb-8">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/30 to-transparent blur-2xl rounded-full" />
          <Image src="/rocket.png" alt="Foguete" fill className="object-contain drop-shadow-[0_10px_30px_rgba(52,211,153,0.4)] relative z-10" />
        </motion.div>

        <div className="mb-10 bg-white/5 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 w-full max-w-sm shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
          
          <p className="text-emerald-100/50 text-xs font-bold uppercase tracking-widest mb-2">Apenas</p>
          <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-200 italic drop-shadow-sm">
            R$ 32,90<span className="text-xl text-emerald-100/50 font-bold not-italic ml-1">/mês</span>
          </h3>
          <p className="text-emerald-400 text-sm font-bold mt-4 italic tracking-wide">por profissional</p>
          
          <div className="mt-6 bg-[#0d2b1d] px-6 py-2.5 rounded-full border border-emerald-500/30 inline-block text-emerald-100 text-sm font-bold shadow-inner">
            Total R$ 32,90/ mês
          </div>
        </div>

        <p className="text-emerald-100/60 text-xs font-medium leading-relaxed max-w-xs mb-12">
          A assinatura fortalece nossa parceria, nos permitindo evoluir a ferramenta constantemente.
        </p>

        <div className="w-full max-w-sm space-y-4 mt-auto">
          <button 
            onClick={() => onNext('PIX')} 
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#05150e] py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:brightness-110 transition-all active:scale-95"
          >
            PAGAR COM PIX
          </button>
          <button 
            onClick={() => onNext('CARD')} 
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-300 text-[#05150e] py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:brightness-110 transition-all active:scale-95"
          >
            Cartão de Crédito
          </button>
        </div>
      </div>
    </motion.div>
  );
}