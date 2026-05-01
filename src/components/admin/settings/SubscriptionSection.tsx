"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { TrialWorkflow } from './TrialWorkflow';
import { useSubscription } from '@/hooks/useSubscription';
import { ActivePlanDetails } from './ActivePlanDetails'; // <-- Importando da forma certa!

export function SubscriptionSection() {
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const { daysRemaining, isPlanActive, loading } = useSubscription();
  const { data: session } = useSession();

  const currentUser = {
    id: session?.user?.id as string,
    name: session?.user?.name as string,
    email: session?.user?.email as string,
    barbershopId: (session?.user as any)?.barbershopId as string,
  };

  // Puxa a data de expiração que salvamos no JWT da sessão
  const planExpiresAt = (session?.user as any)?.planExpiresAt;

  // Estado de Carregamento
  if (loading) {
    return (
      <div className="animate-pulse bg-zinc-900/30 border border-zinc-800/50 h-64 rounded-[2.5rem] w-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Se for PRO, mostra o painel verde importado. Se for FREE, mostra o banner de upgrade. */}
      {isPlanActive ? (
        <ActivePlanDetails expiresAt={planExpiresAt} />
      ) : (
        <div className="relative overflow-hidden bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-600/10 blur-[50px] rounded-full group-hover:bg-orange-600/20 transition-all duration-700 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-24 h-24 mb-4 pointer-events-none"
            >
              <Image
                src="/rocket.png"
                alt="Foguete"
                fill
                className="object-contain drop-shadow-[0_10px_20px_rgba(234,88,12,0.3)]"
              />
            </motion.div>

            <h3 className="text-xl font-black text-white tracking-tight mb-2">
              Leve sua barbearia para o <span className="text-orange-600">próximo nível</span>
            </h3>

            <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-6 max-w-[240px]">
              Sua barbearia merece uma gestão profissional. Desbloqueie todas as ferramentas e cresça sem limites.
            </p>

            <div className="grid grid-cols-2 gap-3 w-full mb-8">
              <div className="bg-black/40 border border-zinc-800 p-3 rounded-2xl flex flex-col items-center">
                <Zap size={16} className="text-orange-500 mb-1" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Agendamento 24h</span>
              </div>
              <div className="bg-black/40 border border-zinc-800 p-3 rounded-2xl flex flex-col items-center">
                <ShieldCheck size={16} className="text-orange-500 mb-1" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Suporte VIP</span>
              </div>
            </div>

            <button
              onClick={() => setIsWorkflowOpen(true)}
              disabled={loading}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-900/20 hover:bg-orange-500 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Fazer Upgrade Agora
            </button>

            <div className="mt-4 flex flex-col items-center min-h-[14px]">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                Período de teste: <span className="text-orange-600/80">
                  {daysRemaining !== null && daysRemaining > 0 ? `${daysRemaining} dias restantes` : "Expirado"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pagamento */}
      <AnimatePresence>
        {isWorkflowOpen && !isPlanActive && (
          <TrialWorkflow 
            forcedOpen={true} 
            onClose={() => setIsWorkflowOpen(false)} 
            userData={currentUser}
          />
        )}
      </AnimatePresence>
    </>
  );
}