"use client";
import { useState } from "react";

export const CalendarPickerModal = ({ isOpen, onClose, onSelect, currentData }: any) => {
    const [viewDate, setViewDate] = useState(new Date(currentData));
    const monthName = viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const changeMonth = (offset: number) => {
        const next = new Date(viewDate);
        next.setMonth(next.getMonth() + offset);
        setViewDate(next);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            <div className="relative w-full max-w-sm bg-surface border border-white/10 rounded-[32px] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => changeMonth(-1)} className="p-2 text-white/40 hover:text-white active:bg-white/5 rounded-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm">{monthName}</h4>
                    <button onClick={() => changeMonth(1)} className="p-2 text-white/40 hover:text-white active:bg-white/5 rounded-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-6">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, index) => (
                        <span key={`day-${index}`} className="text-center text-[11px] font-bold text-accent mb-2">
                            {d}
                        </span>
                    ))}
                    
                    {/* Exemplo de preenchimento - Idealmente use uma lib de calendário como date-fns ou preencha os dias reais */}
                    {Array.from({ length: 31 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                const selected = new Date(viewDate);
                                selected.setDate(i + 1);
                                onSelect(selected.toISOString().split('T')[0]);
                                onClose();
                            }}
                            className="aspect-square flex items-center justify-center text-base font-semibold text-white/80 hover:bg-accent hover:text-white rounded-xl transition-all active:scale-90"
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={onClose} 
                    className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white font-bold uppercase tracking-widest text-xs transition-colors"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};