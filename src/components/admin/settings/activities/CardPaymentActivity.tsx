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
      className="absolute inset-0 flex flex-col bg-[#05150e] overflow-hidden"
    >
      {/* Efeitos de Fundo Artísticos */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/black-paper.png")` }}
      />

      <header className="relative z-10 p-6 flex justify-between items-center border-b border-emerald-900/30 bg-black/20 backdrop-blur-md">
        <button onClick={onBack} className="w-10 flex justify-start text-emerald-100/50 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
          Pagamento Seguro
        </span>
        <button onClick={onClose} className="w-10 flex justify-end text-emerald-100/50 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
        {!error ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center max-w-sm w-full relative overflow-hidden">
            {/* Brilho interno no card */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-yellow-400/30 blur-xl rounded-full" />
              <Loader2 size={64} className="text-yellow-400 relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            </motion.div>

            <h2 className="text-2xl font-black text-white leading-tight mb-4 tracking-tighter italic">
              Preparando ambiente <br /> <span className="text-emerald-400">seguro...</span>
            </h2>
            <p className="text-emerald-100/60 text-sm font-medium leading-relaxed">
              Você será redirecionado para a página de pagamento criptografada.
            </p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center max-w-sm w-full">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-900/40 rounded-full flex items-center justify-center text-red-400 mb-6 border border-red-500/30 shadow-inner">
              <X size={36} />
            </div>
            <h2 className="text-2xl font-black text-white mb-4 italic">Ops! Algo deu errado.</h2>
            <p className="text-emerald-100/60 text-sm mb-8">{error}</p>
            <button
              onClick={onBack}
              className="w-full bg-gradient-to-r from-emerald-600 to-[#0d2b1d] border border-emerald-500/30 text-white py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:brightness-110 transition-all"
            >
              Voltar e tentar novamente
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}