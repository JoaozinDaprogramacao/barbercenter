"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, LogOut, Loader2 } from "lucide-react";

import { TrialWorkflow } from '@/components/admin/settings/billing/TrialWorkflow';

export default function BloqueadoPage() {
  const { data: session, status } = useSession();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const userData = {
    id: (session?.user as any)?.id || "",
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    barbershopId: (session?.user as any)?.barbershopId || "",
  };

  const isOwner = (session?.user as any)?.role === "OWNER";

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center border-x border-white/5 max-w-md mx-auto">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[#B87333]/20 blur-xl rounded-full" />
          <Loader2 className="animate-spin text-[#D49A62] relative z-10 mb-6 drop-shadow-[0_0_15px_rgba(184,115,51,0.5)]" size={56} strokeWidth={2.5} />
        </div>
        <p className="text-[#B87333] font-black tracking-[0.25em] uppercase text-[10px] animate-pulse">
          Verificando credenciais...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center relative overflow-hidden border-x border-white/5">
      
      {/* Efeitos de Fundo Premium (Glows em tons de Cobre) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle,rgba(184,115,51,0.12),transparent_60%)]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(212,154,98,0.1),transparent_70%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <div className="relative mx-auto mb-10 flex h-28 w-28 items-center justify-center rounded-full border border-[#B87333]/30 bg-gradient-to-b from-[#B87333]/20 to-[#050505] shadow-[0_0_40px_rgba(184,115,51,0.25)] backdrop-blur-md">
          <div className="absolute inset-0 rounded-full border border-white/5" />
          <Lock size={46} className="text-[#D49A62] drop-shadow-[0_0_15px_rgba(212,154,98,0.6)]" strokeWidth={2} />
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B87333] mb-3">
          Atenção Necessária
        </p>

        <h1 className="text-[2.5rem] font-black text-[#F7EFE2] mb-6 tracking-tighter leading-tight">
          Acesso <span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent">Suspenso</span>
        </h1>
        
        {isOwner ? (
          <p className="text-zinc-400 font-medium text-[15px] mb-12 leading-relaxed">
            O período da sua assinatura expirou ou há uma pendência no seu pagamento. Regularize seu plano para voltar a gerenciar sua barbearia com o <strong className="text-[#F7EFE2]">BarberCenter PRO</strong>.
          </p>
        ) : (
          <p className="text-zinc-400 font-medium text-[15px] mb-12 leading-relaxed">
            O sistema da barbearia encontra-se temporariamente suspenso devido a pendências de assinatura.
            <br /><br />
            <strong className="text-[#F7EFE2]">Por favor, entre em contato com o dono ou administrador da barbearia para que o acesso seja normalizado.</strong>
          </p>
        )}

        <div className="flex flex-col gap-4">
          {isOwner && (
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="w-full bg-gradient-to-r from-[#D49A62] to-[#B87333] hover:brightness-110 text-[#050505] py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_10px_30px_rgba(184,115,51,0.25)]"
            >
              Regularizar Acesso
              <ArrowRight size={22} strokeWidth={2.5} />
            </button>
          )}

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#B87333]/30 hover:text-[#D49A62] text-zinc-500 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <LogOut size={16} strokeWidth={2.5} />
            Sair da conta
          </button>
        </div>
      </motion.div>

      <TrialWorkflow 
        forcedOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        userData={userData} 
      />
    </div>
  );
}