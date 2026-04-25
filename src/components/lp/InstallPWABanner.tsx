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
          // Ajustado para se adaptar melhor ao mobile e respeitar a Safe Area do iOS
          className="fixed bottom-4 left-3 right-3 z-[100] md:bottom-6 md:left-auto md:right-6 md:w-[420px]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} 
        >
          {/* Tooltip de Instruções para iOS */}
          <AnimatePresence>
            {showIOSInstructions && isIOS && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-3 bg-white text-zinc-900 p-3 md:p-4 rounded-2xl shadow-2xl border border-zinc-200 relative mx-2 md:mx-0"
              >
                <button 
                  onClick={() => setShowIOSInstructions(false)}
                  className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
                >
                  <X size={16} />
                </button>
                <h4 className="font-bold text-sm mb-3 pr-6">Como instalar no iPhone:</h4>
                <ol className="text-xs md:text-sm text-zinc-600 space-y-3">
                  <li className="flex items-start gap-2.5">
                    <span className="bg-zinc-100 p-1.5 rounded-lg shrink-0 mt-0.5">
                      <Share size={14} className="text-blue-500" />
                    </span>
                    <span className="leading-relaxed">
                      1. Toque em <strong>Compartilhar</strong> na barra inferior do Safari.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="bg-zinc-100 p-1.5 rounded-lg shrink-0 mt-0.5">
                      <PlusSquare size={14} className="text-zinc-800" />
                    </span>
                    <span className="leading-relaxed">
                      2. Role o menu e toque em <strong>Adicionar à Tela de Início</strong>.
                    </span>
                  </li>
                </ol>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-zinc-200" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Banner Principal */}
          <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex items-center gap-3 md:gap-4 group">
            
            {/* Ícone */}
            <div className="bg-orange-500/10 p-2.5 md:p-3 rounded-[1rem] md:rounded-2xl border border-orange-500/20 shrink-0">
              <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
            </div>
            
            {/* Textos */}
            <div className="flex-1 min-w-0"> {/* min-w-0 é essencial para o flexbox truncar texto se precisar */}
              <h4 className="text-white font-bold text-sm md:text-base tracking-tight leading-tight">
                Instale nosso App
              </h4>
              <p className="text-zinc-400 text-[11px] md:text-xs mt-0.5 leading-tight truncate md:whitespace-normal">
                Acesso rápido e sem navegador
              </p>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-colors shadow-lg shadow-orange-500/20"
              >
                Instalar
              </button>

              <button
                onClick={() => setIsVisible(false)}
                className="p-1.5 md:p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-full hover:bg-zinc-800 flex-shrink-0"
                aria-label="Fechar"
              >
                <X size={18} className="md:w-5 md:h-5" />
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}