"use client";

import { useSubscription } from '@/hooks/useSubscription';
import { motion } from 'framer-motion';
import { AlertTriangle, Skull, Sparkles, ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

interface TrialBannerProps {
  onUpgradeClick: () => void;
}

// 1. Definimos a interface para as configurações visuais
interface BannerStyleConfig {
  base: string;
  icon: ReactNode;
  button: string;
  glow: string;
  animate?: boolean; // O ponto de interrogação indica que é opcional
}

export function TrialBanner({ onUpgradeClick }: TrialBannerProps) {
  const { activeOffer, loading, isPlanActive } = useSubscription();

  if (loading || isPlanActive || !activeOffer) return null;

  // 2. Tipamos o objeto config explicitamente
  const config: Record<'info' | 'warning' | 'critical', BannerStyleConfig> = {
    info: {
      base: "bg-blue-500/10 border-blue-500/30 text-blue-100",
      icon: <Sparkles size={18} className="text-blue-400" />,
      button: "bg-blue-600 hover:bg-blue-500 shadow-blue-900/40",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]"
    },
    warning: {
      base: "bg-orange-500/10 border-orange-500/30 text-orange-100",
      icon: <AlertTriangle size={18} className="text-orange-400" />,
      button: "bg-orange-600 hover:bg-orange-500 shadow-orange-900/40",
      glow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]"
    },
    critical: {
      base: "bg-red-500/15 border-red-500/40 text-red-50/90",
      icon: <Skull size={18} className="text-red-500" />,
      button: "bg-red-600 hover:bg-red-500 shadow-red-900/50",
      glow: "shadow-[0_0_25px_rgba(239,68,68,0.25)]",
      animate: true 
    }
  };

  const style = config[activeOffer.variant];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        // Usamos uma verificação simples para o Framer Motion
        ...(style.animate ? { scale: [1, 1.01, 1] } : {}) 
      }}
      transition={{ 
        duration: 0.4,
        ...(style.animate ? { repeat: Infinity, duration: 2 } : {})
      }}
      className="px-4 sm:px-6 mb-6"
    >
      <div className={`
        relative overflow-hidden
        backdrop-blur-md p-4 sm:p-5 rounded-[2rem] 
        border ${style.base} ${style.glow}
        flex flex-col sm:flex-row items-start sm:items-center gap-4
      `}>
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-current opacity-[0.03] rounded-full blur-3xl" />

        <div className="flex gap-4 items-start flex-1">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 shrink-0">
            {style.icon}
          </div>
          
          <div className="flex flex-col">
            <h4 className="font-black text-[13px] uppercase tracking-[0.15em] flex items-center gap-2 text-white">
              {activeOffer.title}
            </h4>
            <p className="text-sm font-medium opacity-70 leading-snug mt-1 max-w-[400px]">
              {activeOffer.message}
            </p>
          </div>
        </div>
        
        <button 
          onClick={onUpgradeClick}
          className={`
            w-full sm:w-auto
            ${style.button}
            text-white px-6 py-3 rounded-2xl
            text-[11px] font-black uppercase tracking-widest
            flex items-center justify-center gap-2
            shadow-xl active:scale-95 transition-all duration-200
            group
          `}
        >
          {activeOffer.buttonText}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}