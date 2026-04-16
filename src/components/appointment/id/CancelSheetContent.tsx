import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface CancelSheetContentProps {
    onKeep: () => void;
    onConfirm: () => void;
}

export function CancelSheetContent({ onKeep, onConfirm }: CancelSheetContentProps) {
    return (
        <div className="space-y-8 text-center py-6">
            <div className="w-20 h-20 bg-red-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-red-600/20 shadow-2xl">
                <AlertTriangle size={40} className="text-red-600" />
            </div>
            <div className="space-y-3">
                <h3 className="text-3xl font-black text-white tracking-tighter leading-tight">Confirmar Cancelamento?</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">Esta ação é irreversível e o cliente será notificado via WhatsApp.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <motion.button whileTap={{ scale: 0.95 }} onClick={onKeep} className="py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 font-black uppercase tracking-widest text-[10px]">Manter</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={onConfirm} className="py-5 bg-red-600 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-600/20">Cancelar</motion.button>
            </div>
        </div>
    );
}