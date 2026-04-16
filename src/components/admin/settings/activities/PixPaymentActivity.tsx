"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Copy, Check, X } from 'lucide-react';
import Image from 'next/image';

export function PixPaymentActivity({ onBack, onClose }: { onBack: () => void, onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const pixCode = "00020101021226910014br.gov.bcb.pix2569ap";

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 flex flex-col bg-zinc-950"
    >
      <header className="p-6 flex justify-between items-center border-b border-zinc-900">
        <button onClick={onBack} className="w-10 text-zinc-500"><ChevronLeft size={28} /></button>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Pagamento Pix</span>
        <button onClick={onClose} className="w-10 flex justify-end text-zinc-500"><X size={24} /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 text-center no-scrollbar">
        <h2 className="text-2xl font-black text-white mb-8 tracking-tight">PIX para pagamento</h2>
        
        <div className="bg-white p-6 rounded-[3rem] inline-block mb-8 shadow-2xl">
          <Image src="/qr-code.png" width={220} height={220} alt="QR Code" className="rounded-2xl" />
        </div>

        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 mb-6 font-mono text-[10px] text-zinc-400 break-all">
          {pixCode}
        </div>

        <button onClick={handleCopy} className="w-full bg-orange-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest mb-10 flex items-center justify-center gap-3">
          {copied ? <Check size={20} /> : <Copy size={20} />}
          {copied ? "COPIADO!" : "COPIAR CÓDIGO PIX"}
        </button>

        <div className="space-y-3">
          {["Copie o código Pix acima", "Pague no app do seu banco", "Sua assinatura será ativada em segundos"].map((text, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-900 text-left">
              <span className="text-orange-600 font-black text-xs">{i + 1} -</span>
              <p className="text-zinc-400 text-xs font-bold leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}