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
  userData: UserData;
}

export function CardPaymentActivity({ onBack, onClose, userData }: CardPaymentActivityProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initiateCardCheckout = async () => {
      try {
        const response = await fetch('/api/pagamento/assinatura', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData.id, // MUDOU AQUI: era barbershopId
            name: userData.name,
            email: userData.email,
            taxId: "10981883656", // Lembre de pegar isso de um input depois!
            cellphone: "38999999999"
          })
        });;

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

    if (userData?.barbershopId) {
      initiateCardCheckout();
    }
  }, [userData]);

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 flex flex-col bg-zinc-950"
    >
      <header className="p-6 flex justify-between items-center border-b border-zinc-900">
        <button onClick={onBack} className="w-10 flex justify-start text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">
          Pagamento Seguro
        </span>
        <button onClick={onClose} className="w-10 flex justify-end text-zinc-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
        {!error ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mb-8 text-orange-600"
            >
              <Loader2 size={64} />
            </motion.div>

            <h2 className="text-2xl font-black text-white leading-tight mb-4 tracking-tighter">
              Preparando ambiente <br /> seguro...
            </h2>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xs">
              Você será redirecionado para a página de pagamento criptografada para inserir os dados do seu cartão.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
              <X size={32} />
            </div>
            <h2 className="text-2xl font-black text-white mb-4">Ops! Algo deu errado.</h2>
            <p className="text-zinc-500 text-sm mb-8">{error}</p>
            <button
              onClick={onBack}
              className="w-full max-w-xs bg-zinc-900 border border-zinc-800 text-white py-4 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors"
            >
              Voltar e tentar novamente
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}