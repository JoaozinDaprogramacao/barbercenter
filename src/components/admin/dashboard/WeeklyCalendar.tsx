"use client";

import { motion } from "framer-motion";

interface DayItem {
  day: string;
  date: string;
  fullDate: string;
}

interface WeeklyCalendarProps {
  days: DayItem[];
  selectedDate: string;
  onSelectDate: (fullDate: string) => void;
  onNextWeek: () => void;
  onPrevWeek: () => void;
  onOpenPicker: () => void;
  rangeText: string;
  agendaData: Record<string, any[]>;
}

export const WeeklyCalendar = ({
  days,
  selectedDate,
  onSelectDate,
  onNextWeek,
  onPrevWeek,
  onOpenPicker,
  rangeText,
  agendaData,
}: WeeklyCalendarProps) => {
  const todayFullDate = (() => {
    const d = new Date();
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    return `${day}-${month}`;
  })();

  return (
    <div className="mb-8 space-y-6 px-6">
      <div className="flex items-center justify-between gap-4">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onOpenPicker}
          className="group flex flex-1 items-center gap-4 rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-3 pr-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all hover:border-[#B87333]/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#B87333]/30 bg-[#B87333]/10 text-[#D49A62]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
              Período
            </span>
            <span className="text-sm font-black capitalize tracking-tight text-[#F7EFE2]">
              {rangeText}
            </span>
          </div>
        </motion.button>

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onPrevWeek}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onNextWeek}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </motion.button>
        </div>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 snap-x">
        {days.map((d) => {
          const isSelected = selectedDate === d.fullDate;
          const isToday = todayFullDate === d.fullDate;
          const hasAppointments = !!agendaData[d.fullDate] && agendaData[d.fullDate].length > 0;

          return (
            <motion.button
              key={d.fullDate}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDate(d.fullDate)}
              className={`snap-center flex h-[108px] w-[74px] flex-none flex-col items-center justify-center gap-1 rounded-[1.9rem] border transition-all ${
                isSelected
                  ? "border-[#D49A62]/70 bg-gradient-to-b from-[#6B3A18] to-[#2B1810] text-[#F7EFE2] shadow-[0_16px_35px_rgba(184,115,51,0.18)]"
                  : isToday
                  ? "border-[#B87333]/35 bg-[#161616] text-[#F7EFE2]"
                  : "border-white/10 bg-white/[0.035] text-zinc-500 hover:border-white/20"
              }`}
            >
              <span
                className={`text-[10px] font-black uppercase tracking-[0.22em] ${
                  isSelected ? "text-[#D49A62]" : isToday ? "text-[#D49A62]" : "text-zinc-600"
                }`}
              >
                {d.day}
              </span>

              <span
                className={`text-3xl font-black tracking-tighter ${
                  isSelected || isToday ? "text-[#F7EFE2]" : "text-zinc-400"
                }`}
              >
                {d.date}
              </span>

              <div className="flex h-4 items-center justify-center">
                {isToday && !isSelected ? (
                  <span className="text-[8px] font-black uppercase tracking-tighter text-[#D49A62]">
                    Hoje
                  </span>
                ) : hasAppointments ? (
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSelected
                        ? "bg-[#F7EFE2]"
                        : "bg-[#D49A62] shadow-[0_0_10px_rgba(212,154,98,0.55)]"
                    }`}
                  />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};