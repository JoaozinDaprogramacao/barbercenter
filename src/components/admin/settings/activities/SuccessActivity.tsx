"use client";

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface SuccessActivityProps {
    onClose: () => void;
}

export function SuccessActivity({ onClose }: SuccessActivityProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-50 p-6 text-center"
        >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#10B981]/20 blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="relative z-10"
            >
                <CheckCircle2 size={100} className="text-[#10B981] mb-8 mx-auto drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </motion.div>

            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter relative z-10">
                Pagamento Confirmado!
            </h2>
            <p className="text-zinc-400 font-medium max-w-sm mb-12 relative z-10">
                Seu acesso ao <strong className="text-white">InBarber PRO</strong> foi liberado com sucesso. Aproveite todos os recursos ilimitados para decolar sua barbearia.
            </p>

            <button
                onClick={onClose}
                className="relative z-10 w-full max-w-xs bg-[#10B981] hover:bg-[#059669] text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-emerald-900/20"
            >
                Acessar Sistema
                <ArrowRight size={20} />
            </button>
        </motion.div>
    );
}