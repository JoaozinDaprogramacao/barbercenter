"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Copy, Check, X, Loader2 } from 'lucide-react';

interface AbacatePixData {
  qr_code_base64: string;
  pix_code: string;
}

export function PixPaymentActivity({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [pixData, setPixData] = useState<AbacatePixData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pagamento/pix', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        setPixData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

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
      className="absolute inset-0 flex flex-col bg-zinc-950"
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
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 mt-20 text-[#10B981]">
            <Loader2 className="animate-spin" size={48} />
            <p className="text-sm font-bold text-zinc-400 tracking-widest uppercase">Gerando PIX (AbacatePay)...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black text-white mb-8 tracking-tight">PIX para pagamento</h2>
            
            <div className="bg-white p-6 rounded-[3rem] inline-block mb-8 shadow-2xl">
              {pixData?.qr_code_base64 && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  // O AbacatePay já devolve a string completa com o prefixo "data:image/png;base64,"
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
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest mb-10 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? "COPIADO!" : "COPIAR CÓDIGO PIX"}
            </button>

            <div className="space-y-3">
              {["Copie o código Pix acima", "Pague no app do seu banco", "Sua assinatura será ativada em segundos"].map((text, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-900 text-left items-center">
                  <span className="text-[#10B981] font-black text-xs">{i + 1} -</span>
                  <p className="text-zinc-400 text-xs font-bold leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}