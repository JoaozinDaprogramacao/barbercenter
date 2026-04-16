"use client";
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

export function PlanSummaryActivity({ onClose, onNext }: { onClose: () => void, onNext: (t: 'PIX'|'CARD') => void }) {
  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 flex flex-col bg-zinc-950"
    >
      <header className="p-6 flex justify-between items-center border-b border-zinc-900">
        <div className="w-10" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Assinatura</span>
        <button onClick={onClose} className="w-10 flex justify-end text-zinc-500"><X size={24} /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-black text-white leading-tight mb-8 tracking-tighter">
          Este é seu plano de <br/> assinatura atual
        </h2>
        
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} className="relative w-52 h-52 mb-8">
          <Image src="/rocket.png" alt="Foguete" fill className="object-contain drop-shadow-[0_0_50px_rgba(234,88,12,0.4)]" />
        </motion.div>

        <div className="mb-10">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Apenas</p>
          <h3 className="text-5xl font-black text-white italic">R$ 32,90<span className="text-xl text-zinc-500 font-bold not-italic">/mês</span></h3>
          <p className="text-white/60 text-sm font-bold mt-4 italic">por profissional</p>
          <div className="mt-4 bg-zinc-900 px-6 py-2 rounded-full border border-zinc-800 inline-block text-white text-sm font-bold">
            Total R$ 32,90/ mês
          </div>
        </div>

        <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-xs mb-12">
          A assinatura fortalece nossa parceria, nos permitindo evoluir a ferramenta constantemente.
        </p>

        <div className="w-full max-w-xs space-y-4 mt-auto">
          <button onClick={() => onNext('PIX')} className="w-full bg-[#00A382] text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/20">PIX</button>
          <button onClick={() => onNext('CARD')} className="w-full bg-orange-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-900/20">Cartão de Crédito</button>
        </div>
      </div>
    </motion.div>
  );
}