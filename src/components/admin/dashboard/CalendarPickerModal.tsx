"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CalendarPickerModal = ({ isOpen, onClose, onSelect, currentData }: any) => {
    // Tenta converter a string de data atual para um objeto Date válido para a visualização
    const [viewDate, setViewDate] = useState(() => {
        // Se currentData for no formato "10-abr", precisamos de um fallback para hoje
        // ou converter adequadamente. Para o visualizador, usamos Date padrão.
        return new Date();
    });

    const monthName = viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const changeMonth = (offset: number) => {
        const next = new Date(viewDate);
        next.setMonth(next.getMonth() + offset);
        setViewDate(next);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
                    {/* Backdrop Otimizado */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose} 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm will-change-opacity" 
                    />

                    {/* Modal Container */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl will-change-transform"
                    >
                        {/* Header do Calendário */}
                        <div className="flex justify-between items-center mb-8">
                            <button 
                                onClick={() => changeMonth(-1)} 
                                className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-xl transition-all active:scale-90"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                            
                            <h4 className="text-white font-black uppercase tracking-[0.15em] text-xs">
                                {monthName}
                            </h4>

                            <button 
                                onClick={() => changeMonth(1)} 
                                className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-xl transition-all active:scale-90"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>

                        {/* Dias da Semana */}
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, index) => (
                                <span key={`day-${index}`} className="text-center text-[10px] font-black text-orange-600/50 uppercase tracking-widest">
                                    {d}
                                </span>
                            ))}
                        </div>

                        {/* Grid de Dias (Simulado 31 dias para o exemplo) */}
                        <div className="grid grid-cols-7 gap-1 mb-8">
                            {Array.from({ length: 31 }).map((_, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        const selected = new Date(viewDate);
                                        selected.setDate(i + 1);
                                        // Formata para o padrão esperado pelo seu hook (YYYY-MM-DD)
                                        const year = selected.getFullYear();
                                        const month = String(selected.getMonth() + 1).padStart(2, '0');
                                        const day = String(selected.getDate()).padStart(2, '0');
                                        onSelect(`${year}-${month}-${day}`);
                                        onClose();
                                    }}
                                    className="aspect-square flex items-center justify-center text-sm font-bold text-zinc-300 hover:bg-orange-600 hover:text-white rounded-xl transition-all"
                                >
                                    {i + 1}
                                </motion.button>
                            ))}
                        </div>

                        {/* Botão de Fechar Otimizado */}
                        <motion.button 
                            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose} 
                            className="w-full py-4 bg-zinc-800 text-zinc-400 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all"
                        >
                            Cancelar
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};