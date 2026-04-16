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
    <div className="px-6 space-y-6 mb-8">
      {/* HEADER: Range e Navegação */}
      <div className="flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenPicker}
          className="flex items-center gap-3 group transition-all"
        >
          <div className="w-10 h-10 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center group-hover:border-orange-500/50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Período</span>
            <span className="text-sm font-bold text-white capitalize">{rangeText}</span>
          </div>
        </motion.button>

        <div className="flex gap-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onPrevWeek} 
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onNextWeek} 
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* LISTA DE DIAS: Estilo Pílula Premium */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x">
        {days.map((d) => {
          const isSelected = selectedDate === d.fullDate;
          const isToday = todayFullDate === d.fullDate;
          const hasAppointments = !!agendaData[d.fullDate] && agendaData[d.fullDate].length > 0;

          return (
            <motion.button
              key={d.fullDate}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDate(d.fullDate)}
              className={`snap-center flex-none w-[72px] h-[105px] rounded-[2rem] flex flex-col items-center justify-center gap-1 transition-all border-2 will-change-transform
                ${isSelected
                  ? "bg-orange-600 border-orange-500 text-white shadow-[0_10px_20px_rgba(249,115,22,0.2)]"
                  : isToday
                  ? "bg-zinc-900 border-orange-600/30 text-white"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                }`}
            >
              <span className={`text-[10px] font-black uppercase tracking-widest
                ${isSelected ? "text-white/70" : isToday ? "text-orange-500" : "text-zinc-600"}`}>
                {d.day}
              </span>

              <span className={`text-2xl font-black tracking-tighter ${isSelected || isToday ? "text-white" : "text-zinc-400"}`}>
                {d.date}
              </span>

              {/* Indicador de "Hoje" ou Agendamentos */}
              <div className="h-4 flex items-center justify-center">
                {isToday && !isSelected ? (
                  <span className="text-[8px] font-black text-orange-500 uppercase tracking-tighter">Hoje</span>
                ) : hasAppointments ? (
                  <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"}`} />
                ) : null}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};