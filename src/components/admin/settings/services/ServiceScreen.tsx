"use client";

import { motion } from "framer-motion";
import { ChevronRight, Plus } from "lucide-react";

interface Service { 
  id: number; 
  name: string; 
  price: string | number; 
}

interface ServicesSectionProps {
  services: Service[];
  editingId?: number;
  onAdd: () => void;
  onSelect: (s: Service) => void;
}

// Função para pegar até 2 letras do serviço (Ex: "Corte Degradê" -> "CD", "Barba" -> "BA")
const getInitials = (name: string) => {
  if (!name) return "SV";
  const words = name.trim().split(" ").filter(w => w.length > 0);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const ServicesSection = ({ services, editingId, onAdd, onSelect }: ServicesSectionProps) => (
  <div className="w-full flex flex-col flex-1 pb-10">
    
    {/* HEADER DA SEÇÃO */}
    <div className="flex justify-between items-end px-6 pb-4">
      <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-4">
        Catálogo de Serviços
      </h3>
    </div>

    {/* ÁREA DA LISTA */}
    <div className="w-full px-5 space-y-3">
      
      {/* Botão de Adicionar (Estilo Card Tracejado Vivo) */}
      <motion.button 
        whileTap={{ scale: 0.98 }}
        onClick={onAdd}
        className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-[#B87333]/30 bg-[#B87333]/5 hover:bg-[#B87333]/10 transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-[#D49A62]/10 flex items-center justify-center text-[#D49A62] group-hover:scale-110 transition-transform">
          <Plus size={24} strokeWidth={2.5} />
        </div>
        <div className="text-left">
          <h4 className="text-[#D49A62] font-bold text-[15px]">Adicionar Novo</h4>
          <p className="text-[#D49A62]/60 text-[12px] font-medium mt-0.5">Corte, barba, combos...</p>
        </div>
      </motion.button>

      {/* Lista de Serviços */}
      {services.map((s, index) => {
        const isActive = editingId === s.id;
        const initials = getInitials(s.name);
        
        return (
          <motion.button 
            key={s.id} 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(s)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all relative overflow-hidden group
              ${isActive 
                ? 'bg-gradient-to-r from-[#111] to-[#0A0A0A] border-[#D49A62]/50 shadow-[0_5px_20px_rgba(212,154,98,0.15)]' 
                : 'bg-[#0A0A0A] border-zinc-800/80 hover:border-zinc-700'
              }
            `}
          >
            {/* Brilho de fundo quando ativo */}
            {isActive && <div className="absolute inset-0 bg-gradient-to-r from-[#D49A62]/5 to-transparent pointer-events-none" />}

            <div className="flex items-center gap-4 relative z-10">
              {/* Monograma do Serviço no lugar da tesoura */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors shadow-inner
                ${isActive 
                  ? 'bg-gradient-to-br from-[#D49A62] to-[#B87333] border-transparent text-[#050505] shadow-lg' 
                  : 'bg-zinc-900 border-zinc-800/80 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-[#D49A62]'
                }
              `}>
                <span className="font-black text-[15px] tracking-wider">
                  {initials}
                </span>
              </div>

              {/* Informações */}
              <div className="text-left flex flex-col justify-center">
                <span className={`text-[15px] font-bold tracking-tight transition-colors
                  ${isActive ? 'text-white' : 'text-zinc-200'}
                `}>
                  {s.name}
                </span>
                <span className="text-[12px] text-zinc-500 font-medium mt-0.5">
                  Toque para editar
                </span>
              </div>
            </div>

            {/* Preço e Seta */}
            <div className="flex items-center gap-3 relative z-10">
              <div className={`px-3 py-1.5 rounded-lg font-black text-[13px] tracking-wide transition-colors
                ${isActive 
                  ? 'bg-[#050505] text-[#D49A62]' 
                  : 'bg-zinc-900 text-zinc-400'
                }
              `}>
                R$ {Number(s.price).toFixed(2).replace('.', ',')}
              </div>
              <ChevronRight size={18} className={isActive ? "text-[#D49A62]" : "text-zinc-700"} />
            </div>

          </motion.button>
        );
      })}
    </div>

  </div>
);