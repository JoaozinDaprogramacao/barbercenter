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
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <div className="relative w-full max-w-sm bg-[#121212] border border-white/10 rounded-[40px] p-8 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => changeMonth(-1)} className="text-white/40 hover:text-white"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg></button>
                    <h4 className="text-white font-black uppercase tracking-widest text-xs">{monthName}</h4>
                    <button onClick={() => changeMonth(1)} className="text-white/40 hover:text-white"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg></button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-8">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, index) => (
                        <span key={`day-${index}`} className="text-center text-[10px] font-black text-accent/50">
                            {d}
                        </span>
                    ))}
                    {/* Lógica simplificada de dias para o exemplo */}
                    {Array.from({ length: 30 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                const selected = new Date(viewDate);
                                selected.setDate(i + 1);
                                onSelect(selected.toISOString().split('T')[0]);
                                onClose();
                            }}
                            className="aspect-square flex items-center justify-center text-sm font-bold text-white/60 hover:bg-accent hover:text-white rounded-xl transition-all"
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button onClick={onClose} className="w-full py-4 bg-white/5 rounded-2xl text-white font-black uppercase tracking-widest text-[10px]">Fechar</button>
            </div>
        </div>
    );
};