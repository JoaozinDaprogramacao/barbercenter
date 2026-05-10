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
      className="absolute inset-0 z-50 flex flex-col bg-[#050505] overflow-hidden"
    >
      {/* Efeitos Artísticos Premium (Glows Acobreados) */}
      <div className="absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[400px] bg-[radial-gradient(circle_at_bottom_left,rgba(212,154,98,0.10),transparent_50%)] pointer-events-none" />

      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-md">
        <button 
          onClick={onBack} 
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2] active:scale-90"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#B87333]">Pagamento Pix</span>
        <button 
          onClick={onClose} 
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2] active:scale-90"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto p-8 text-center no-scrollbar">
        {step === 'FORM' ? (
          <form onSubmit={handleGeneratePix} className="mx-auto max-w-sm space-y-6 mt-6 text-left">
            <div className="mb-8 text-left">
              <h2 className="text-[2rem] font-black leading-none tracking-tighter text-[#F7EFE2]">
                Dados de <br/>
                <span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent">Faturamento</span>
              </h2>
              <p className="mt-3 text-[13px] font-medium text-zinc-400">Informe os dados para gerar a cobrança via Pix.</p>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 shadow-xl backdrop-blur-sm">
              <div className="text-left">
                <label className="ml-3 text-[10px] font-black uppercase tracking-widest text-[#B87333]/80">CPF ou CNPJ</label>
                <input
                  required
                  placeholder="000.000.000-00"
                  value={taxId}
                  onChange={e => setTaxId(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0A0A0A] p-4 text-[#F7EFE2] placeholder:text-zinc-600 focus:border-[#B87333]/50 focus:outline-none focus:ring-1 focus:ring-[#B87333]/50 transition-all shadow-inner"
                />
              </div>
              <div className="text-left">
                <label className="ml-3 text-[10px] font-black uppercase tracking-widest text-[#B87333]/80">WhatsApp / Celular</label>
                <input
                  required
                  placeholder="(00) 9 0000-0000"
                  value={cellphone}
                  onChange={e => setCellphone(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0A0A0A] p-4 text-[#F7EFE2] placeholder:text-zinc-600 focus:border-[#B87333]/50 focus:outline-none focus:ring-1 focus:ring-[#B87333]/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-gradient-to-r from-[#D49A62] to-[#B87333] py-4 text-[12px] font-black uppercase tracking-[0.2em] text-[#050505] shadow-[0_10px_25px_rgba(184,115,51,0.25)] transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin text-[#050505]" size={20} /> : "GERAR QR CODE PIX"}
            </button>
          </form>
        ) : (
          <div className="mx-auto max-w-sm mt-4 flex flex-col items-center">
            <h2 className="mb-8 text-[2rem] font-black tracking-tighter text-[#F7EFE2] leading-none">
              PIX <span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent">Gerado</span>
            </h2>

            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-[2.5rem] bg-[#B87333]/20 blur-2xl" />
              <div className="relative rounded-[2.5rem] border-4 border-white/5 bg-white p-6 shadow-[0_0_40px_rgba(184,115,51,0.15)]">
                {pixData?.qr_code_base64 && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={pixData.qr_code_base64}
                    width={220}
                    height={220}
                    alt="QR Code Pix"
                    className="rounded-xl"
                  />
                )}
              </div>
            </div>

            <div className="relative mb-6 w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5 font-mono text-[11px] text-zinc-400 break-all shadow-inner backdrop-blur-md">
               <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#B87333]/30 to-transparent" />
              {pixData?.pix_code}
            </div>

            <button
              onClick={handleCopy}
              disabled={!pixData?.pix_code}
              className="mb-8 flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-gradient-to-r from-[#D49A62] to-[#B87333] py-4 text-[12px] font-black uppercase tracking-[0.2em] text-[#050505] shadow-[0_10px_25px_rgba(184,115,51,0.25)] transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
            >
              {copied ? <Check size={20} className="text-[#050505]" /> : <Copy size={20} className="text-[#050505]" />}
              {copied ? "COPIADO!" : "COPIAR CÓDIGO PIX"}
            </button>

            <div className="flex flex-col items-center justify-center gap-3 text-zinc-500">
              <Loader2 className="animate-spin text-[#B87333]" size={28} />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D49A62] animate-pulse">Aguardando pagamento...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}