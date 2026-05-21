"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Tipagem básica para a notificação que vem do banco
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface DashboardHeaderProps {
  showValues: boolean;
  onToggleValues: () => void;
  userName: string;
  onOpenMenu: () => void;
  onOpenSchedule: () => void;
  // 🔥 Props de notificação atualizadas:
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAsRead: () => void;
}

export const DashboardHeader = ({
  showValues,
  userName,
  onToggleValues,
  onOpenMenu,
  onOpenSchedule,
  notifications,
  unreadCount,
  onMarkAsRead,
}: DashboardHeaderProps) => {
  // Controle local para abrir/fechar o pop-up do sininho
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleNotifications = () => {
    const willOpen = !isDropdownOpen;
    setIsDropdownOpen(willOpen);
    
    // Se está abrindo e tem mensagem não lida, avisa o pai (page.tsx) para zerar no banco
    if (willOpen && unreadCount > 0) {
      onMarkAsRead();
    }
  };

  return (
    <header className="relative px-6 pb-7 pt-7">
      {/* ... LOGO CENTRAL MANTIDA ... */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col items-center justify-center"
      >
        <img src="/imgs/logo-full.png" alt="Logo da Barbearia" className="h-32 w-auto object-contain drop-shadow-xl" />
      </motion.div>

      {/* CONTEÚDO */}
      <div className="flex items-start justify-between gap-4">
        {/* ... TÍTULO E BOTÃO AGENDA MANTIDOS ... */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="max-w-[230px]">
          <h1 className="text-[2.65rem] font-black leading-none tracking-tighter text-[#F7EFE2]">
            Olá, <span className="bg-gradient-to-r from-[#E0A56A] to-[#B87333] bg-clip-text text-transparent">{userName}</span>
          </h1>
          <p className="mt-3 text-[1.05rem] font-medium text-zinc-300">Bem-vindo de volta! 👋</p>
          <button onClick={onOpenSchedule} className="mt-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-300 backdrop-blur-xl transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2] active:scale-95">
            Sua Agenda
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </button>
        </motion.div>

        {/* BOTOES DA DIREITA */}
        <div className="flex gap-3">
          
          {/* BOTÃO EYE */}
          <motion.button onClick={onToggleValues} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} className="relative flex h-14 w-14 items-center justify-center rounded-[1.4rem] border border-white/10 bg-black/30 text-[#F7EFE2] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all hover:border-[#B87333]/40">
             {/* ... SVG DO OLHO MANTIDO ... */}
             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {showValues ? (
                <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>
              ) : (
                <><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></>
              )}
            </svg>
          </motion.button>

          {/* 🔥 CONTAINER DO SINO COM O POP-UP (RELATIVE É IMPORTANTE AQUI) */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleToggleNotifications}
              className={`relative flex h-14 w-14 items-center justify-center rounded-[1.4rem] border transition-all backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${isDropdownOpen ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 bg-black/30 text-[#F7EFE2] hover:border-[#B87333]/40'}`}
            >
              {unreadCount > 0 && (
                <span className="absolute right-3 top-3 flex h-[10px] w-[10px]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E0A56A] opacity-75"></span>
                  <span className="relative inline-flex h-[10px] w-[10px] rounded-full bg-[#E0A56A] shadow-[0_0_8px_rgba(224,165,106,0.8)]"></span>
                </span>
              )}
              
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </motion.button>

            {/* 🔥 MENU FLUTUANTE DE NOTIFICAÇÕES */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-[calc(100%+12px)] z-50 w-72 sm:w-80 overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A]/95 p-4 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#F7EFE2] tracking-wide">Notificações</h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-[#D49A62]/20 px-2 py-0.5 text-[10px] font-bold text-[#D49A62]">
                        {unreadCount} novas
                      </span>
                    )}
                  </div>

                  <div className="flex max-h-[320px] flex-col gap-2 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 opacity-50">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-2 text-white">
                          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                        <p className="text-xs text-center text-zinc-300">Tudo limpo por aqui.</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`relative overflow-hidden rounded-[1rem] border p-3 transition-colors ${
                            !notif.isRead 
                              ? 'border-[#D49A62]/30 bg-[#D49A62]/10' 
                              : 'border-white/5 bg-white/[0.02]'
                          }`}
                        >
                          {!notif.isRead && (
                             <span className="absolute left-0 top-0 h-full w-[3px] bg-[#D49A62]"></span>
                          )}
                          <h4 className={`text-xs font-bold ${!notif.isRead ? 'text-[#D49A62]' : 'text-zinc-400'}`}>
                            {notif.title}
                          </h4>
                          <p className={`mt-1 text-[11px] leading-relaxed ${!notif.isRead ? 'text-zinc-200' : 'text-zinc-500'}`}>
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOTÃO MENU */}
          <motion.button onClick={onOpenMenu} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] border border-white/10 bg-black/30 text-[#F7EFE2] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all hover:border-[#B87333]/40">
             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
          </motion.button>
        </div>
      </div>
    </header>
  );
};