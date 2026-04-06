interface DayItem {
  day: string;
  date: string;
}

interface WeeklyCalendarProps {
  days: DayItem[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  agendaData: Record<string, any[]>;
}

export const WeeklyCalendar = ({ days, selectedDate, onSelectDate, agendaData }: WeeklyCalendarProps) => {
  return (
    <div className="px-6 space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-medium text-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          15 abr 2024 à 21 abr 2024
        </div>
        
        {/* SETAS REMOVIDAS DAQUI */}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 snap-x">
        {days.map((d) => (
          <button 
            key={d.date} 
            onClick={() => onSelectDate(d.date)}
            className={`snap-center flex-none w-[60px] h-[75px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95
              ${selectedDate === d.date 
                ? 'bg-accent text-white shadow-[0_10px_20px_rgba(178,123,92,0.3)]' 
                : 'bg-surface text-text-secondary hover:bg-surface-light'}`}
          >
            <span className="text-[10px] font-bold">{d.day}</span>
            <span className={`text-xl font-bold ${selectedDate === d.date ? 'text-white' : 'text-text-primary'}`}>{d.date}</span>
            {agendaData[d.date] && <span className="w-1.5 h-1.5 rounded-full bg-success"></span>}
          </button>
        ))}
      </div>
    </div>
  );
};