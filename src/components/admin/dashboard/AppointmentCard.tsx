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
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all hover:border-[#B87333]/35"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.12),transparent_38%)] opacity-70 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-[#B87333]/30 bg-[#B87333]/10 text-[#D49A62]">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-70">
              Hora
            </span>
            <span className="text-sm font-black tracking-tight text-[#F7EFE2]">
              {time}
            </span>
          </div>

          <div>
            <h4 className="text-xl font-black leading-tight tracking-tight text-[#F7EFE2]">
              {name}
            </h4>

            <p className="mt-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#D49A62]">
              {service}
            </p>

            {badge && (
              <span className="mt-3 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-tight text-emerald-400">
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#B87333]/25 bg-[#B87333]/10 px-4 py-2 text-sm font-black text-[#F7EFE2]">
          {price}
        </div>
      </div>
    </motion.div>
  );
};