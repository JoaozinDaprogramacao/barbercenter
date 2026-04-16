"use client";

import { motion } from "framer-motion";

interface AppointmentCardProps {
  time: string;
  name: string;
  service: string;
  price: string;
  badge?: string;
  onClick?: () => void;
}

export const AppointmentCard = ({
  time,
  name,
  service,
  price,
  badge,
  onClick,
}: AppointmentCardProps) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(39, 39, 42, 0.8)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-zinc-900 rounded-[2.5rem] p-7 flex flex-col gap-10 relative border border-zinc-800 transition-all cursor-pointer group shadow-2xl will-change-transform"
    >
      {/* LINHA SUPERIOR: HORÁRIO E AÇÕES */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-zinc-500 uppercase tracking-widest leading-none">
              Horário
            </span>
            <span className="text-lg font-bold text-white mt-1 tracking-tight">
              {time}
            </span>
          </div>

          {badge && (
            <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-full border border-green-500/20 uppercase tracking-tighter">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* LINHA INFERIOR: CLIENTE E VALOR */}
      <div className="flex justify-between items-end">
        <div className="space-y-1.5">
          <h4 className="text-2xl font-black text-white tracking-tighter leading-none">
            {name}
          </h4>
          <p className="text-[11px] font-bold text-orange-600/80 uppercase tracking-[0.2em]">
            {service}
          </p>
        </div>

        <div className="flex items-center gap-2 text-white font-black text-sm bg-orange-600/10 px-4 py-2.5 rounded-2xl border border-orange-500/20 shadow-lg shadow-orange-500/5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h22" />
          </svg>
          {price}
        </div>
      </div>

      {/* DETALHE DE DESIGN: BRILHO SUTIL NO HOVER */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/0 to-orange-600/0 group-hover:from-orange-600/5 group-hover:to-transparent rounded-[2.5rem] transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
};