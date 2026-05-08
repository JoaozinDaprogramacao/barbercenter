"use client";

import { motion } from "framer-motion";

interface DashboardHeaderProps {
  showValues: boolean;
  onToggleValues: () => void;
  userName: string;
  onOpenMenu: () => void;
  onOpenSchedule: () => void;
}

export const DashboardHeader = ({
  showValues,
  userName,
  onToggleValues,
  onOpenMenu,
  onOpenSchedule,
}: DashboardHeaderProps) => {
  return (
    <header className="relative px-6 pb-7 pt-7">
      {/* LOGO CENTRAL (IMAGEM PNG) */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col items-center justify-center"
      >
        <img
          src="/imgs/logo-full.png"
          alt="Logo da Barbearia"
          className="h-32 w-auto object-contain drop-shadow-xl" /* AJUSTE O TAMANHO (h-32) SE NECESSÁRIO */
        />
      </motion.div>

      {/* CONTEÚDO */}
      <div className="flex items-start justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-[230px]"
        >
          <h1 className="text-[2.65rem] font-black leading-none tracking-tighter text-[#F7EFE2]">
            Olá,{" "}
            <span className="bg-gradient-to-r from-[#E0A56A] to-[#B87333] bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>

          <p className="mt-3 text-[1.05rem] font-medium text-zinc-300">
            Bem-vindo de volta! 👋
          </p>

          <button
            onClick={onOpenSchedule}
            className="mt-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-300 backdrop-blur-xl transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2] active:scale-95"
          >
            Sua Agenda
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </motion.div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={onToggleValues}
            className="relative flex h-14 w-14 items-center justify-center rounded-[1.4rem] border border-white/10 bg-black/30 text-[#F7EFE2] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all hover:border-[#B87333]/40"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {showValues ? (
                <>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ) : (
                <>
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </>
              )}
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={onOpenMenu}
            className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] border border-white/10 bg-black/30 text-[#F7EFE2] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all hover:border-[#B87333]/40"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </motion.button>
        </div>
      </div>
    </header>
  );
};