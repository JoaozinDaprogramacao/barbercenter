"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CalendarPickerModal = ({ isOpen, onClose, onSelect, currentData }: any) => {
  const [viewDate, setViewDate] = useState(() => {
    return new Date();
  });

  const monthName = viewDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (offset: number) => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + offset);
    setViewDate(next);
  };

  // Cálculos do calendário
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#111111] p-7 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.18),transparent_40%)]" />

            <div className="relative z-10">
              <div className="mb-8 flex items-center justify-between">
                <button
                  onClick={() => changeMonth(-1)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2] active:scale-90"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#B87333]">
                    Calendário
                  </span>
                  <h4 className="mt-1 text-sm font-black uppercase tracking-[0.14em] text-[#F7EFE2]">
                    {monthName}
                  </h4>
                </div>

                <button
                  onClick={() => changeMonth(1)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2] active:scale-90"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 grid grid-cols-7 gap-1">
                {["D", "S", "T", "Q", "Q", "S", "S"].map((d, index) => (
                  <span
                    key={`day-${index}`}
                    className="text-center text-[10px] font-black uppercase tracking-widest text-[#B87333]/70"
                  >
                    {d}
                  </span>
                ))}
              </div>

              <div className="mb-8 grid grid-cols-7 gap-1.5">
                {/* Espaços vazios para alinhar o primeiro dia do mês */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Dias reais do mês */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNumber = i + 1;
                  return (
                    <motion.button
                      key={dayNumber}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNumber);
                        
                        const year = selected.getFullYear();
                        const month = String(selected.getMonth() + 1).padStart(2, "0");
                        const day = String(selected.getDate()).padStart(2, "0");

                        onSelect(`${year}-${month}-${day}`);
                        onClose();
                      }}
                      className="flex aspect-square items-center justify-center rounded-xl text-sm font-black text-zinc-300 transition-all hover:bg-[#B87333] hover:text-[#F7EFE2]"
                    >
                      {dayNumber}
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-4 text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400 transition-all hover:text-[#F7EFE2]"
              >
                Cancelar
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};