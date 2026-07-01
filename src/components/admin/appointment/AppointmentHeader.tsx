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
      className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#F7EFE2]/50 hover:text-[#F7EFE2] transition-colors"
    >
      <ChevronLeft size={24} strokeWidth={2.5} />
    </motion.button>
  
  </header>
);