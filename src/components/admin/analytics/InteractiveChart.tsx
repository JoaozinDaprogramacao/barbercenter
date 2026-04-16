"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChartData {
  label: string;
  height: string;
  atendimentos: number;
  bruto: string;
  liquido: string;
  np: string;
}

export const InteractiveChart = ({ data }: { data: ChartData[] }) => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedLabel(null);
    if (scrollRef.current && data.length > 7) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
      }, 100);
    }
  }, [data]);

  const handleBarClick = (label: string) => {
    setSelectedLabel(selectedLabel === label ? null : label);
  };

  const isScrollable = data.length > 7;
  const innerWidthClass = isScrollable ? "min-w-[600px]" : "w-full";

  return (
    <section className="relative z-10 mt-2">
      <div
        ref={scrollRef}
        className="overflow-x-auto no-scrollbar -mx-2 px-2 pb-4 pt-[130px] -mt-[130px] pointer-events-none"
      >
        <div className={`flex items-end justify-between gap-3 border-b border-zinc-800 pb-2 relative z-10 ${innerWidthClass} h-44 pointer-events-auto`}>
          
          {/* Linhas de Grade de Fundo (Dashed) */}
          <div className="absolute inset-0 flex justify-between px-2 -z-10 h-full pointer-events-none">
            {[...Array(isScrollable ? 12 : 7)].map((_, i) => (
              <div key={i} className="w-px h-full border-l border-dashed border-zinc-800/50" />
            ))}
          </div>

          {data.map((item, index) => {
            const isActive = selectedLabel === item.label;
            const isFirst = index < 2;
            const isLast = index > data.length - 3;
            const tooltipPosition = isFirst ? "left-0" : isLast ? "right-0" : "left-1/2 -translate-x-1/2";
            const arrowPosition = isFirst ? "left-4" : isLast ? "right-4" : "left-1/2 -translate-x-1/2";

            return (
              <div 
                key={item.label} 
                className="h-full flex items-end justify-center flex-1 cursor-pointer group" 
                onClick={() => handleBarClick(item.label)}
              >
                <div className="relative w-full max-w-[32px] flex justify-center h-full">
                  
                  {/* TOOLTIP PREMIUM */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute bottom-[105%] mb-4 z-30 bg-zinc-950 border border-zinc-800 rounded-[1.5rem] p-4 shadow-2xl w-max min-w-[160px] ${tooltipPosition} will-change-transform`}
                      >
                        <p className="text-orange-500 font-black text-xs uppercase tracking-widest mb-2">{item.label}</p>
                        <div className="space-y-1.5 text-[11px] font-bold">
                          <div className="flex justify-between gap-4">
                            <span className="text-zinc-500">Atendimentos</span>
                            <span className="text-white">{item.atendimentos}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-zinc-500">Bruto</span>
                            <span className="text-white">R$ {item.bruto}</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-zinc-800">
                            <span className="text-orange-600/70">Líquido</span>
                            <span className="text-orange-500">R$ {item.liquido}</span>
                          </div>
                        </div>
                        {/* Seta do Tooltip */}
                        <div className={`absolute -bottom-1.5 w-3 h-3 bg-zinc-950 border-b border-r border-zinc-800 rotate-45 ${arrowPosition}`} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* BARRA ANIMADA */}
                  <div className="relative w-full h-full flex items-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: item.height }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className={`w-full rounded-t-xl transition-all duration-300 relative will-change-[height] ${
                        isActive 
                          ? 'bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)]' 
                          : 'bg-zinc-800 group-hover:bg-zinc-700'
                      }`}
                    >
                        {/* Gradiente de brilho interno na barra */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-t-xl pointer-events-none" />
                    </motion.div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rótulos do Eixo X */}
        <div className={`flex justify-between mt-4 px-1 ${innerWidthClass} pointer-events-auto`}>
          {data.map((item) => (
            <span 
              key={`label-${item.label}`} 
              onClick={() => handleBarClick(item.label)} 
              className={`text-[9px] font-black uppercase flex-1 text-center cursor-pointer transition-colors tracking-tighter ${
                selectedLabel === item.label ? 'text-orange-500' : 'text-zinc-600'
              }`}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Indicador de Scroll (Apenas se for scrollable) */}
      {isScrollable && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 mt-4"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <div className="flex items-center gap-2">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-700">
                <path d="m15 18-6-6 6-6"/>
            </svg>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 whitespace-nowrap">Deslize para ver mais</p>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-700">
                <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </motion.div>
      )}
    </section>
  );
};