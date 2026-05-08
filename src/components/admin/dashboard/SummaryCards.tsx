"use client";

import { motion } from "framer-motion";

interface SummaryCardsProps {
  showValues: boolean;
  todayRevenue: string;
  todayCount: number;
  weekRevenue: string;
  weekCount: number;
  todayImage?: string;
  weekImage?: string;
}

export const SummaryCards = ({
  showValues,
  todayRevenue,
  todayCount,
  weekRevenue,
  weekCount,
  todayImage = "/imgs/cards/today-barber.png",
  weekImage = "/imgs/cards/week-pole.png",
}: SummaryCardsProps) => {
  
  const MetricContent = ({
    title,
    count,
    revenue,
    accent = false,
  }: {
    title: string;
    count: number;
    revenue: string;
    accent?: boolean;
  }) => {
    return (
      <div className="relative z-20 flex h-full flex-col justify-between">
        {/* HEADER: ICON + TITLE */}
        <div className="flex items-center gap-2.5">
          <div className={`
            flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-md
            ${accent ? "border-[#D49A62]/30 bg-[#D49A62]/10 text-[#D49A62]" : "border-white/10 bg-white/5 text-zinc-400"}
          `}>
            {accent ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20v-6" /></svg>
            )}
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${accent ? "text-[#D49A62]" : "text-zinc-400"}`}>
            {title}
          </span>
        </div>

        {/* BODY: DATA STACK */}
        <div className="flex flex-col gap-1.5 mt-4">
          {/* AGENDAMENTOS CONTAINER */}
          <div className="flex items-end justify-between px-1">
             <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-500 mb-1">Agendamentos:</span>
             <span className="text-2xl font-black leading-none text-white tracking-tighter">
                {count}
             </span>
          </div>

          {/* DIVISOR */}
          <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

          {/* FATURAMENTO CONTAINER */}
          <div className="flex flex-col px-1 pt-1">
             <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-500 mb-1">Faturamento</span>
             <span className={`text-lg font-black leading-none tracking-tight ${accent ? "text-[#F2A86B]" : "text-white"}`}>
                {showValues ? revenue : "••••••"}
             </span>
          </div>
        </div>

        {/* FOOTER DECORATION */}
        <div className="flex justify-center mt-3">
           <div className={`h-1 w-8 rounded-full ${accent ? "bg-[#D49A62]/30" : "bg-white/10"}`} />
        </div>
      </div>
    );
  };

  return (
    <div className="mx-5 mb-8 grid grid-cols-2 gap-4">
      {/* CARD HOJE */}
      <motion.div
        whileTap={{ scale: 0.96 }}
        className="relative min-h-[190px] overflow-hidden rounded-[2.2rem] border border-[#B87333]/30 bg-[#0C0B0A] p-5 shadow-2xl"
      >
        {/* Background Image com Overlay melhorado para legibilidade */}
        {todayImage && (
          <img
            src={todayImage}
            alt=""
            className="pointer-events-none absolute right-[-20%] top-0 z-0 h-full w-auto object-cover opacity-20 mix-blend-lighten"
          />
        )}
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-[#0C0B0A] via-[#0C0B0A]/80 to-transparent" />
        
        <MetricContent
          title="Hoje"
          count={todayCount}
          revenue={todayRevenue}
          accent
        />
      </motion.div>

      {/* CARD SEMANA */}
      <motion.div
        whileTap={{ scale: 0.96 }}
        className="relative min-h-[190px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#0F1012] p-5 shadow-xl"
      >
        {weekImage && (
          <img
            src={weekImage}
            alt=""
            className="pointer-events-none absolute right-[-20%] top-0 z-0 h-full w-auto object-cover opacity-15 mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-[#0F1012] via-[#0F1012]/90 to-transparent" />

        <MetricContent
          title="Semana"
          count={weekCount}
          revenue={weekRevenue}
        />
      </motion.div>
    </div>
  );
};