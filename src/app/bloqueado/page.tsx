"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, LogOut, Loader2 } from "lucide-react";

import { TrialWorkflow } from '@/components/admin/settings/TrialWorkflow';


export default function BloqueadoPage() {
  const { data: session, status } = useSession();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Monta o userData baseado na sessão ativa para repassar ao componente de pagamento
  const userData = {
    id: (session?.user as any)?.id || "",
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    barbershopId: (session?.user as any)?.barbershopId || "",
  };

  // Se a sessão ainda está carregando, mostra um loader para evitar piscar a tela
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-red-500 mb-4" size={48} />
        <p className="text-zinc-400 font-bold tracking-widest uppercase text-sm animate-pulse">
          Verificando credenciais...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* Luz vermelha de fundo para dar o tom de "alerta" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <Lock size={40} className="text-red-500" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
          Acesso Bloqueado
        </h1>
        
        <p className="text-zinc-400 font-medium text-base md:text-lg mb-10 leading-relaxed">
          O período da sua assinatura expirou ou há uma pendência no seu pagamento. Regularize seu plano para voltar a gerenciar sua barbearia com o InBarber PRO.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setIsPaymentOpen(true)}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
          >
            Regularizar Acesso
            <ArrowRight size={20} />
          </button>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white py-4 rounded-[2rem] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <LogOut size={16} />
            Sair da conta
          </button>
        </div>
      </motion.div>

      {/* Renderiza o seu fluxo de pagamento pronto por cima de tudo */}
      <TrialWorkflow 
        forcedOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        userData={userData} 
      />
    </div>
  );
}