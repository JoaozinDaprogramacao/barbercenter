"use client";

import { motion } from 'framer-motion';
import { ChevronLeft, X, CreditCard, Rocket, ChevronRight } from 'lucide-react';

interface CardPaymentActivityProps {
  onBack: () => void;
  onClose: () => void;
}

export function CardPaymentActivity({ onBack, onClose }: CardPaymentActivityProps) {
  return (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 flex flex-col bg-zinc-950"
    >
      {/* Header Nativo */}
      <header className="p-6 flex justify-between items-center border-b border-zinc-900">
        <button onClick={onBack} className="w-10 text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft size={28} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">
          Pagamento Cartão
        </span>
        <button onClick={onClose} className="w-10 flex justify-end text-zinc-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </header>

      {/* Conteúdo da Activity */}
      <div className="flex-1 overflow-y-auto p-8 text-center flex flex-col no-scrollbar">
        <div className="mt-12 mb-8">
          <div className="w-24 h-24 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard size={40} className="text-orange-600" />
          </div>
          <h2 className="text-3xl font-black text-white leading-tight tracking-tighter mb-4">
            Assinatura via <br/> Cartão de Crédito
          </h2>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed px-4">
            Estamos preparando um checkout ultra seguro para você salvar seus cartões com facilidade.
          </p>
        </div>

        {/* Card de Transição (Nudge para o PIX) */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 relative overflow-hidden text-left mb-8">
          <div className="absolute -top-4 -right-4 opacity-10">
            <Rocket size={100} className="text-orange-600" />
          </div>
          
          <h4 className="text-white font-black uppercase text-[11px] tracking-widest mb-3">Ativação Instantânea</h4>
          <p className="text-zinc-400 text-xs font-bold leading-relaxed mb-6">
            O pagamento via PIX é liberado na mesma hora. Se você tem pressa para começar, recomendamos usar o PIX agora.
          </p>

          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-orange-600 font-black text-[11px] uppercase tracking-widest group"
          >
            Voltar para o PIX 
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-900">
            <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest text-left">
              Segurança nível bancário com criptografia SSL
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}