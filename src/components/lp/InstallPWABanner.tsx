'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, PlusSquare, Smartphone } from 'lucide-react';

export function InstallPWABanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('Para instalar, procure a opção "Adicionar à Tela Inicial" no menu do seu navegador.');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-3 right-3 z-[100] md:bottom-6 md:left-auto md:right-6 md:w-[420px]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} 
        >
          {/* Tooltip de Instruções para iOS (Dark Premium) */}
          <AnimatePresence>
            {showIOSInstructions && isIOS && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-3 bg-[#111111] text-[#F7EFE2] p-4 md:p-5 rounded-[1.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-white/10 relative mx-2 md:mx-0 backdrop-blur-xl"
              >
                <button 
                  onClick={() => setShowIOSInstructions(false)}
                  className="absolute top-3 right-3 p-2 text-zinc-500 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                >
                  <X size={16} />
                </button>
                <h4 className="font-black text-sm mb-4 pr-6 tracking-tight">Como instalar no iPhone:</h4>
                <ol className="text-xs md:text-sm text-zinc-400 space-y-3 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="bg-white/5 border border-white/10 p-1.5 rounded-lg shrink-0">
                      <Share size={14} className="text-blue-400" />
                    </span>
                    <span className="leading-relaxed mt-0.5">
                      1. Toque em <strong className="text-white">Compartilhar</strong> na barra inferior do Safari.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-white/5 border border-white/10 p-1.5 rounded-lg shrink-0">
                      <PlusSquare size={14} className="text-zinc-300" />
                    </span>
                    <span className="leading-relaxed mt-0.5">
                      2. Role o menu e toque em <strong className="text-white">Adicionar à Tela de Início</strong>.
                    </span>
                  </li>
                </ol>
                {/* Seta do tooltip */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#111111] rotate-45 border-b border-r border-white/10" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Banner Principal */}
          <div className="bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-3 md:gap-4 group">
            
            {/* Ícone */}
            <div className="bg-[#B87333]/20 p-2.5 md:p-3 rounded-[1rem] md:rounded-[1.2rem] border border-[#B87333]/30 shrink-0">
              <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-[#D49A62]" strokeWidth={2.5} />
            </div>
            
            {/* Textos */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[#F7EFE2] font-black text-sm md:text-base tracking-tight leading-tight">
                Instale nosso App
              </h4>
              <p className="text-zinc-400 font-medium text-[11px] md:text-xs mt-0.5 leading-tight truncate md:whitespace-normal">
                Acesso rápido e sem navegador
              </p>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="bg-gradient-to-r from-[#D49A62] to-[#B87333] hover:brightness-110 text-[#050505] px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-widest transition-all shadow-[0_5px_15px_rgba(184,115,51,0.25)]"
              >
                Instalar
              </button>

              <button
                onClick={() => setIsVisible(false)}
                className="p-1.5 md:p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/5 flex-shrink-0"
                aria-label="Fechar"
              >
                <X size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}