"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft, Loader2 } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  barbershopId: string;
}

interface CardPaymentActivityProps {
  onBack: () => void;
  onClose: () => void;
  onSuccess: () => void;
  userData: UserData;
}

export function CardPaymentActivity({ onBack, onClose, onSuccess, userData }: CardPaymentActivityProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initiateCardCheckout = async () => {
      try {
        const response = await fetch('/api/pagamento/assinatura', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData.id,
            name: userData.name,
            email: userData.email,
            taxId: "10981883656",
            cellphone: "38999999999"
          })
        });

        const data = await response.json();

        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          setError(data.error || "Não foi possível gerar o checkout seguro.");
        }
      } catch (err: any) {
        setError("Erro de conexão. Tente novamente.");
      }
    };

    if (userData?.id) {
      initiateCardCheckout();
    }
  }, [userData]);

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 flex flex-col bg-[#050505] overflow-hidden"
    >
      {/* Efeitos Premium do Dashboard (Glows Acobreados) */}
      <div className="absolute top-0 right-0 h-[400px] w-full bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[400px] w-full bg-[radial-gradient(circle_at_bottom_left,rgba(212,154,98,0.10),transparent_50%)] pointer-events-none" />

      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-md">
        <button 
          onClick={onBack} 
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2] active:scale-90"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#B87333]">
          Pagamento Seguro
        </span>
        <button 
          onClick={onClose} 
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2] active:scale-90"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
        {!error ? (
          <div className="group relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.12),transparent_40%)]" />
            
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="mb-8"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#B87333]/30 bg-[#B87333]/10 text-[#D49A62] shadow-[0_0_20px_rgba(184,115,51,0.2)]">
                  <Loader2 size={36} strokeWidth={2.5} />
                </div>
              </motion.div>

              <h2 className="text-2xl font-black leading-tight tracking-tighter text-[#F7EFE2] mb-3">
                Preparando ambiente <br /> seguro...
              </h2>
              <p className="text-sm font-medium leading-relaxed text-zinc-400">
                Você será redirecionado para a página criptografada.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 backdrop-blur-md shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.8rem] border border-red-500/20 bg-red-500/10 text-red-400 mb-6 shadow-inner">
              <X size={36} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-[#F7EFE2] mb-3">Ops! Algo deu errado.</h2>
            <p className="text-sm font-medium text-zinc-500 mb-8">{error}</p>
            <button
              onClick={onBack}
              className="w-full rounded-[1.5rem] bg-zinc-800/80 border border-white/10 py-4 px-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#F7EFE2] transition-all hover:bg-zinc-700 hover:text-white active:scale-95"
            >
              Voltar e Tentar Novamente
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}