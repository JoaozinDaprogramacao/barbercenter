"use client";

interface DayItem {
    day: string;
    date: string;
    fullDate: string;
}

interface WeeklyCalendarProps {
    days: DayItem[];
    selectedDate: string;
    onSelectDate: (day: string) => void;
    onNextWeek: () => void;
    onPrevWeek: () => void;
    onOpenPicker: () => void; // Garanta que esta prop existe
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
    return (
        <div className="px-6 space-y-4 mb-6">
            <div className="flex items-center justify-between">
                {/* BOTÃO QUE ABRE O MODAL CUSTOMIZADO */}
                <button
                    onClick={onOpenPicker}
                    className="flex items-center gap-2 text-white font-medium text-xs tracking-tight active:scale-95 transition-all group"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent group-hover:scale-110 transition-transform">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="group-hover:text-accent transition-colors">{rangeText}</span>
                </button>

                <div className="flex gap-4">
                    {/* SETA VOLTAR SEMANA */}
                    <button
                        onClick={onPrevWeek}
                        className="w-8 h-8 rounded-xl bg-surface border border-white/5 flex items-center justify-center text-white/40 hover:text-white active:scale-90 transition-all"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>

                    {/* SETA PRÓXIMA SEMANA */}
                    <button
                        onClick={onNextWeek}
                        className="w-8 h-8 rounded-xl bg-surface border border-white/5 flex items-center justify-center text-white/40 hover:text-white active:scale-90 transition-all"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>

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
                            <span className="text-xl font-black text-white">
                                {d.date}
                            </span>

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