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
        <div className="px-6 space-y-5 mb-8"> {/* Aumentado espaçamento inferior */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onOpenPicker}
                    className="flex items-center gap-3 text-white font-bold text-sm tracking-tight active:scale-95 transition-all group" // Aumentado texto e gap
                >
                    <div className="p-2 bg-surface rounded-lg border border-white/5 group-hover:border-accent/30 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </div>
                    <span className="group-hover:text-accent transition-colors capitalize">{rangeText}</span>
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={onPrevWeek}
                        className="w-10 h-10 rounded-xl bg-surface border border-white/5 flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-all" // Botão maior (w-10)
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>

                    <button
                        onClick={onNextWeek}
                        className="w-10 h-10 rounded-xl bg-surface border border-white/5 flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-all"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 snap-x">
                {days.map((d) => {
                    const isSelected = selectedDate === d.date;
                    const hasAppointments = !!agendaData[d.fullDate];

                    return (
                        <button
                            key={d.fullDate}
                            onClick={() => onSelectDate(d.date)}
                            className={`snap-center flex-none w-[70px] h-[95px] rounded-[22px] flex flex-col items-center justify-center gap-2 transition-all active:scale-95 border
                                ${isSelected
                                    ? 'bg-accent border-accent text-white shadow-[0_10px_25px_rgba(178,123,92,0.4)]'
                                    : 'bg-surface border-white/5 text-white/40 hover:bg-surface-light'
                                }`}
                        >
                            <span className={`text-[11px] font-black tracking-[0.1em] uppercase ${isSelected ? 'text-white/80' : 'text-white/30'}`}>
                                {d.day}
                            </span>
                            <span className="text-2xl font-black text-white"> {/* Data maior */}
                                {d.date}
                            </span>

                            {hasAppointments && (
                                <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};