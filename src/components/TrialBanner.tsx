"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface TrialBannerProps {
  onUpgradeClick: () => void;
}

export function TrialBanner({ onUpgradeClick }: TrialBannerProps) {
  const { daysRemaining, isPlanActive, loading } = useSubscription();

  // 1. BLOQUEIO DE PISCA-PISCA: Se está carregando ou plano está ativo, não renderiza nada.
  // Retornar null impede que o React desenhe o componente "pela metade".
  if (loading || isPlanActive || daysRemaining === null) return null;

  // 2. LÓGICA DE EXIBIÇÃO: Só mostra se estiver expirado (0) ou nos últimos 3 dias.
  const shouldShow = daysRemaining > 0 && daysRemaining <= 3; // Só mostra se faltar 1, 2 ou 3 dias.

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="px-6 mb-6"
      >
        <div className="bg-red-950/20 border border-red-900/30 rounded-[2.5rem] p-6 relative overflow-hidden group">
          {/* Brilho de fundo fixo - removemos animações pulsantes aqui */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[50px] rounded-full pointer-events-none" />

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-red-500/20">
              <AlertTriangle className="text-red-500" size={24} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                  {daysRemaining === 0 ? "Acesso Expirado" : "Último Aviso"}
                </span>
              </div>

              <h3 className="text-lg font-black text-white tracking-tight leading-tight mb-2">
                {daysRemaining === 1
                  ? "Seu acesso expira amanhã!"
                  : `Seu acesso expira em ${daysRemaining} dias!`}
              </h3>

              <p className="text-zinc-500 text-xs leading-relaxed mb-6">
                Não perca seus agendamentos e o histórico dos seus clientes. Assine agora para continuar usando.
              </p>

              <button
                onClick={onUpgradeClick}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-900/20"
              >
                Assinar e Liberar
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}