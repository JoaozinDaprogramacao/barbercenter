"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Copy, Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface AbacatePixData {
  qr_code_base64: string;
  pix_code: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  barbershopId: string;
}

export function PixPaymentActivity({
  onBack,
  onClose,
  userData
}: {
  onBack: () => void;
  onClose: () => void;
  userData: UserData;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState<'FORM' | 'PAYMENT'>('FORM');
  const [copied, setCopied] = useState(false);
  const [pixData, setPixData] = useState<AbacatePixData | null>(null);
  const [loading, setLoading] = useState(false);

  const [taxId, setTaxId] = useState('');
  const [cellphone, setCellphone] = useState('');

  const handleGeneratePix = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/pagamento/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          name: userData.name,
          email: userData.email,
          taxId: taxId,
          cellphone: cellphone
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPixData(data);
        setStep('PAYMENT');
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Erro ao gerar PIX:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (pixData?.pix_code) {
      navigator.clipboard.writeText(pixData.pix_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (step === 'PAYMENT') {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`/api/user/plan-status?userId=${userData.id}`);
          const data = await res.json();

          if (data.planStatus === 'PRO') {
            clearInterval(intervalId);
            await update();
            onClose();
            router.push('/sucesso');
          }
        } catch (error) {
          console.error("Aguardando confirmação...");
        }
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [step, userData.id, onClose, router, update]);

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 flex flex-col bg-[#05150e] z-50 overflow-hidden"
    >
      {/* Efeitos Artísticos */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/black-paper.png")` }}
      />

      <header className="relative z-10 p-6 flex justify-between items-center border-b border-emerald-900/30 bg-black/20 backdrop-blur-md">
        <button onClick={onBack} className="w-10 text-emerald-100/50 hover:text-white transition-colors">
          <ChevronLeft size={28} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Pagamento Pix</span>
        <button onClick={onClose} className="w-10 flex justify-end text-emerald-100/50 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto p-8 text-center no-scrollbar">
        {step === 'FORM' ? (
          <form onSubmit={handleGeneratePix} className="max-w-sm mx-auto space-y-6 text-left mt-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white tracking-tighter italic">
                Dados de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-200">Faturamento</span>
              </h2>
              <p className="text-emerald-100/60 text-sm mt-3">Informe os dados para gerar a cobrança via AbacatePay.</p>
            </div>

            <div className="space-y-4 bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 shadow-xl">
              <div>
                <label className="text-[10px] font-bold text-emerald-100/50 uppercase ml-4 tracking-widest">CPF ou CNPJ</label>
                <input
                  required
                  placeholder="000.000.000-00"
                  value={taxId}
                  onChange={e => setTaxId(e.target.value)}
                  className="w-full bg-[#0d2b1d]/50 border border-emerald-900/50 rounded-2xl p-4 text-white placeholder:text-emerald-100/20 focus:border-emerald-400 focus:bg-[#0d2b1d] outline-none transition-all mt-2 shadow-inner"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-emerald-100/50 uppercase ml-4 tracking-widest">WhatsApp / Celular</label>
                <input
                  required
                  placeholder="(38) 9 9999-9999"
                  value={cellphone}
                  onChange={e => setCellphone(e.target.value)}
                  className="w-full bg-[#0d2b1d]/50 border border-emerald-900/50 rounded-2xl p-4 text-white placeholder:text-emerald-100/20 focus:border-emerald-400 focus:bg-[#0d2b1d] outline-none transition-all mt-2 shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#05150e] py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin text-[#05150e]" size={20} /> : "GERAR QR CODE"}
            </button>
          </form>
        ) : (
          <div className="max-w-sm mx-auto mt-4">
            <h2 className="text-2xl font-black text-white mb-8 tracking-tighter italic">
              PIX para <span className="text-emerald-400">pagamento</span>
            </h2>

            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full" />
              <div className="relative bg-white p-6 rounded-[2.5rem] shadow-[0_0_40px_rgba(52,211,153,0.15)] border-4 border-emerald-50/10">
                {pixData?.qr_code_base64 && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={pixData.qr_code_base64}
                    width={220}
                    height={220}
                    alt="QR Code AbacatePay"
                    className="rounded-xl"
                  />
                )}
              </div>
            </div>

            <div className="bg-black/40 p-5 rounded-[1.5rem] border border-emerald-500/20 mb-6 font-mono text-[11px] text-emerald-200/80 break-all shadow-inner relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
              {pixData?.pix_code}
            </div>

            <button
              onClick={handleCopy}
              disabled={!pixData?.pix_code}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#05150e] py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest mb-8 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] disabled:opacity-50"
            >
              {copied ? <Check size={20} className="text-[#05150e]" /> : <Copy size={20} className="text-[#05150e]" />}
              {copied ? "COPIADO!" : "COPIAR CÓDIGO PIX"}
            </button>

            <div className="flex flex-col items-center justify-center gap-4 text-emerald-100/50">
              <Loader2 className="animate-spin text-yellow-400" size={28} />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Aguardando pagamento...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}