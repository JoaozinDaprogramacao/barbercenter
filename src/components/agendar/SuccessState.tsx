import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function SuccessState({ date, time }: { date: string, time: string }) {
  return (
    <motion.div
      key="success-step"
      className="flex flex-col items-center justify-center py-12 text-center"
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
        <div className="relative w-24 h-24 bg-gradient-to-b from-emerald-500/20 to-emerald-900/20 rounded-[2.5rem] flex items-center justify-center border border-emerald-500/30 shadow-inner">
          <CheckCircle2 size={46} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" strokeWidth={2.5} />
        </div>
      </div>
      
      <h2 className="text-[2rem] font-black text-[#F7EFE2] uppercase tracking-tighter mb-2 leading-none">
        Confirmado!
      </h2>
      <p className="text-zinc-400 text-sm mb-10 font-medium">
        Te esperamos dia {date.replace('-', ' de ')} às <span className="text-[#D49A62] font-bold">{time}</span>.
      </p>
      
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase text-[#B87333] tracking-[0.2em] hover:bg-white/[0.05] hover:text-[#D49A62] transition-all active:scale-95"
      >
        Novo Agendamento
      </button>
    </motion.div>
  );
}