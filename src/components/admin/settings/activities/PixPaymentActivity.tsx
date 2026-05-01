"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Copy, Check, X, Loader2 } from 'lucide-react';

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
  onSuccess,
  userData
}: {
  onBack: () => void;
  onClose: () => void;
  onSuccess: () => void;
  userData: UserData;
}) {
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

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 flex flex-col bg-zinc-950 z-50"
    >
      <header className="p-6 flex justify-between items-center border-b border-zinc-900">
        <button onClick={onBack} className="w-10 text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft size={28} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981]">Pagamento Pix</span>
        <button onClick={onClose} className="w-10 flex justify-end text-zinc-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 text-center no-scrollbar">
        {step === 'FORM' ? (
          <form onSubmit={handleGeneratePix} className="max-w-sm mx-auto space-y-6 text-left mt-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight">Dados de Faturamento</h2>
              <p className="text-zinc-500 text-sm mt-2">Informe os dados para gerar a cobrança via AbacatePay.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-4">CPF ou CNPJ</label>
                <input
                  required
                  placeholder="000.000.000-00"
                  value={taxId}
                  onChange={e => setTaxId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:border-[#10B981] outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-4">WhatsApp / Celular</label>
                <input
                  required
                  placeholder="(38) 9 9999-9999"
                  value={cellphone}
                  onChange={e => setCellphone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:border-[#10B981] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "GERAR QR CODE"}
            </button>
          </form>
        ) : (
          <>
            <h2 className="text-2xl font-black text-white mb-8 tracking-tight">PIX para pagamento</h2>

            <div className="bg-white p-6 rounded-[3rem] inline-block mb-8 shadow-2xl">
              {pixData?.qr_code_base64 && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={pixData.qr_code_base64}
                  width={220}
                  height={220}
                  alt="QR Code AbacatePay"
                  className="rounded-2xl"
                />
              )}
            </div>

            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 mb-6 font-mono text-[10px] text-zinc-400 break-all">
              {pixData?.pix_code}
            </div>

            <button
              onClick={handleCopy}
              disabled={!pixData?.pix_code}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest mb-6 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? "COPIADO!" : "COPIAR CÓDIGO PIX"}
            </button>

            <div className="space-y-3 mb-8">
              {["Copie o código Pix acima", "Pague no app do seu banco", "Sua assinatura será ativada em segundos"].map((text, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-900 text-left items-center">
                  <span className="text-[#10B981] font-black text-xs">{i + 1} -</span>
                  <p className="text-zinc-400 text-xs font-bold leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={onSuccess}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-[2rem] font-bold text-xs uppercase tracking-widest transition-colors border border-zinc-700"
            >
              Já realizei o pagamento
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}