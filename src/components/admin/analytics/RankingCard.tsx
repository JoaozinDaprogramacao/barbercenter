"use client";

import { motion } from "framer-motion";
import { Scissors, Package } from "lucide-react";

// Exportamos a interface para poder reaproveitar no arquivo principal
export interface ServiceItem {
  name: string;
  count: number;
  type?: "SERVICE" | "PRODUCT"; 
}

interface RankingCardProps {
  item: ServiceItem;
  index: number;
}

export const RankingCard = ({ item, index }: RankingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileTap={{ scale: 0.95 }}
      className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex flex-col justify-between aspect-square relative overflow-hidden group transition-colors hover:border-[#B87333]/40 will-change-transform w-full"
    >
      {/* TOPO: Número + Ícone */}
      <div className="relative z-10 flex justify-between items-start">
        <span className="text-6xl font-black text-[#B87333] tracking-tighter block group-hover:scale-110 transition-transform duration-500 origin-left">
          {item.count}
        </span>
        
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-[#B87333]/20 group-hover:text-[#D49A62] transition-colors shrink-0">
           {item.type === 'PRODUCT' ? <Package size={16} strokeWidth={2.5} /> : <Scissors size={16} strokeWidth={2.5} />}
        </div>
      </div>

      {/* NOME DO ITEM */}
      <div className="relative z-10 mt-4">
        <span className="text-[#F7EFE2] font-black text-sm leading-tight tracking-tight uppercase">
          {item.name}
        </span>
      </div>

      {/* Brilho de Fundo */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#B87333]/5 blur-[40px] rounded-full group-hover:bg-[#B87333]/15 transition-all duration-700" />
    </motion.div>
  );
};