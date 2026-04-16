"use client";

import { motion } from "framer-motion";

interface Service { id: number; name: string; price: string; }

interface ServicesSectionProps {
  services: Service[];
  editingId?: number;
  onAdd: () => void;
  onSelect: (s: Service) => void;
}

export const ServicesSection = ({ services, editingId, onAdd, onSelect }: ServicesSectionProps) => (
  <section className="mt-8">
    <div className="flex justify-between items-center mb-6 px-2">
      <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Meus Serviços</h3>
    </div>
    
    <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 snap-x pb-6">
      {/* Botão de Adicionar Novo */}
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={onAdd} 
        className="snap-center flex-none w-[80px] h-[180px] rounded-[2.5rem] bg-zinc-900/40 border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-orange-600 hover:border-orange-600/50 transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </motion.button>

      {/* Lista de Serviços */}
      {services.map((s, index) => {
        const isActive = editingId === s.id;
        return (
          <motion.div 
            key={s.id} 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(s)}
            className={`snap-center flex-none w-[170px] rounded-[2.5rem] p-7 border-2 relative transition-all cursor-pointer will-change-transform
              ${isActive 
                ? 'bg-orange-600 border-orange-500 shadow-lg shadow-orange-600/20' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
          >
            <div className={`w-10 h-1.5 rounded-full mb-10 ${isActive ? 'bg-white/30' : 'bg-orange-600/20'}`}></div>
            
            <h5 className="text-white font-black text-xl leading-tight tracking-tighter mb-1 uppercase">
              {s.name}
            </h5>
            
            <p className={`text-sm font-black tracking-tight ${isActive ? 'text-white' : 'text-zinc-500'}`}>
              R$ {s.price}
            </p>

            {isActive && (
              <div className="absolute top-6 right-6 w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </motion.div>
        );
      })}
    </div>
  </section>
);