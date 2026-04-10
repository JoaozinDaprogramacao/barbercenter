"use client";

import { useMemo } from "react";

interface DateSelectorProps {
  value: string;
  onChange: (date: string) => void;
}

export const DateSelector = ({ value, onChange }: DateSelectorProps) => {
  // Gera os próximos 30 dias dinamicamente
  const dates = useMemo(() => {
    const generatedDates = [];
    const today = new Date();
    
    // Arrays para traduzir os dados gerados pelo JavaScript
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    for (let i = 0; i <= 30; i++) { // Loop de 0 a 30 dias
      const dateObj = new Date(today);
      dateObj.setDate(today.getDate() + i);

      const dayNumber = dateObj.getDate().toString().padStart(2, '0');
      const monthName = months[dateObj.getMonth()];
      const weekDayName = weekDays[dateObj.getDay()];

      generatedDates.push({
        id: `${dayNumber}-${monthName.toLowerCase()}`, // Ex: '06-abr'
        day: weekDayName, // Ex: 'Seg'
        date: dayNumber,  // Ex: '06'
        month: monthName  // Ex: 'Abr'
      });
    }
    return generatedDates;
  }, []);

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x pt-2">
      {dates.map((item) => {
        const isActive = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`
              snap-center flex-none w-[90px] py-6 rounded-2xl border transition-all duration-300
              ${isActive
                ? 'bg-white text-black border-white shadow-lg scale-105'
                // Removido o opacity-40 e text-text-secondary. Agora usa branco com 80% de opacidade para legibilidade perfeita
                : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'}
            `}
          >
            {/* Opacidade aplicada apenas aos detalhes (dia da semana e mês) para dar hierarquia ao número */}
            <span className={`block text-[10px] font-bold uppercase mb-1 ${isActive ? 'opacity-60' : 'text-white/50'}`}>
              {item.day}
            </span>

            <span className={`block text-2xl font-black ${isActive ? 'text-black' : 'text-white'}`}>
              {item.date}
            </span>

            <span className={`block text-[10px] font-bold uppercase mt-1 ${isActive ? 'opacity-60' : 'text-white/50'}`}>
              {item.month}
            </span>
          </button>
        );
      })}
    </div>
  );
};