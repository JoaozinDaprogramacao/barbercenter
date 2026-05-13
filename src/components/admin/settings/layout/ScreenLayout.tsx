"use client";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

export const ScreenLayout = ({ title, onBack, children }: any) => (
  // min-h-screen garante que o preto vá até o final, independente do tamanho do conteúdo
  <main className="min-h-[100dvh] w-full flex flex-col bg-[#050505] max-w-md mx-auto relative overflow-x-hidden font-sans border-x border-white/5">
    
    {/* Header Fixo */}
    <header className="px-6 py-6 flex items-center border-b border-zinc-900 bg-[#050505] sticky top-0 z-20">
      <button onClick={onBack} className="flex items-center text-[#D49A62] active:opacity-50 p-1 -ml-2">
        <ChevronLeft size={28} />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 w-full text-center pointer-events-none">
        <h1 className="text-[11px] font-black text-white uppercase tracking-[0.3em] px-12 truncate">
          {title}
        </h1>
      </div>
    </header>

    {/* Área de Conteúdo - Expandida para ocupar todo o resto da tela */}
    <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto no-scrollbar">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col flex-1 pb-20"
      >
        {children}
      </motion.div>
    </div>
  </main>
);