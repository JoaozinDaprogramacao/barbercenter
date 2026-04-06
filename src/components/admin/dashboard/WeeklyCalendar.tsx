"use client";

interface DayItem {
  day: string;
  date: string;
  fullDate: string;
}

interface WeeklyCalendarProps {
  days: DayItem[];
  selectedDate: string; // Ex: "16" (apenas o dia para o CSS)
  onSelectDate: (day: string) => void;
  onNextWeek: () => void;
  onPrevWeek: () => void;
  rangeText: string;
  agendaData: Record<string, any[]>;
}

export const WeeklyCalendar = ({ 
  days, 
  selectedDate, 
  onSelectDate, 
  onNextWeek, 
  onPrevWeek, 
  rangeText, 
  agendaData 
}: WeeklyCalendarProps) => {
  return (
    <div className="px-6 space-y-4 mb-6">
      {/* HEADER DO CALENDÁRIO COM NAVEGAÇÃO */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-medium text-xs tracking-tight">
          {/* ÍCONE DE CALENDÁRIO (SVG) */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {rangeText}
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={onPrevWeek} 
            className="w-8 h-8 rounded-xl bg-surface border border-white/5 flex items-center justify-center text-white/40 hover:text-white active:scale-90 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <button 
            onClick={onNextWeek} 
            className="w-8 h-8 rounded-xl bg-surface border border-white/5 flex items-center justify-center text-white/40 hover:text-white active:scale-90 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {/* LISTA DE DIAS (SCROLL HORIZONTAL) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 snap-x">
        {days.map((d) => {
          const isSelected = selectedDate === d.date;
          const hasAppointments = !!agendaData[d.fullDate];

          return (
            <button 
              key={d.fullDate} 
              onClick={() => onSelectDate(d.date)}
              className={`snap-center flex-none w-[62px] h-[80px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border
                ${isSelected 
                  ? 'bg-accent border-accent text-white shadow-[0_10px_20px_rgba(178,123,92,0.3)]' 
                  : 'bg-surface border-white/5 text-white/40 hover:bg-surface-light'
                }`}
            >
              <span className={`text-[9px] font-black tracking-widest ${isSelected ? 'text-white/70' : 'text-white/30'}`}>
                {d.day}
              </span>
              <span className={`text-xl font-black ${isSelected ? 'text-white' : 'text-white'}`}>
                {d.date}
              </span>
              
              {/* BOLINHA DE AGENDAMENTO */}
              {hasAppointments && (
                <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-green-500'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};