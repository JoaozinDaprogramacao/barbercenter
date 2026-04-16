"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Bell, Check } from "lucide-react";

interface AppointmentHeaderProps {
  onBack: () => void;
  onSendReminder: () => void;
  reminderSent: boolean;
}

export const AppointmentHeader = ({ onBack, onSendReminder, reminderSent }: AppointmentHeaderProps) => (
  <header className="px-6 pt-12 pb-6 flex items-center justify-between shrink-0 relative z-30">
    {/* Botão de Voltar */}
    <motion.button 
      whileTap={{ scale: 0.9 }}
      onClick={onBack} 
      className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
    >
      <ChevronLeft size={24} strokeWidth={2.5} />
    </motion.button>
    
    {/* Botão de Lembrete */}
    <motion.button 
      whileTap={{ scale: 0.95 }}
      onClick={onSendReminder}
      className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-xl ${
        reminderSent 
          ? 'bg-green-600 text-white shadow-green-600/20' 
          : 'bg-zinc-900 border border-zinc-800 text-orange-500 hover:bg-zinc-800'
      }`}
    >
      <span>{reminderSent ? 'Enviado' : 'Lembrete'}</span>
      {reminderSent ? (
        <Check size={14} strokeWidth={4} />
      ) : (
        <Bell size={14} strokeWidth={3} className="animate-pulse" />
      )}
    </motion.button>
  </header>
);