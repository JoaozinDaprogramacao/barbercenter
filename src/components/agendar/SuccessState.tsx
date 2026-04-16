import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function SuccessState({ date, time }: { date: string, time: string }) {
  return (
    <motion.div
      key="success-step"
      className="flex flex-col items-center justify-center py-12 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-green-500/20">
        <CheckCircle2 size={40} className="text-green-500" strokeWidth={2} />
      </div>
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Confirmado!</h2>
      <p className="text-zinc-500 text-sm mb-8">
        Te esperamos dia {date.replace('-', ' de ')} às {time}.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="text-[10px] font-black uppercase text-zinc-500 tracking-widest hover:text-white transition-colors"
      >
        Novo Agendamento
      </button>
    </motion.div>
  );
}