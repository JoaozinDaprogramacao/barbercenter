"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Edit3,
  MessageCircle,
  CheckCircle2,
  CreditCard,
  User
} from "lucide-react";

interface AppointmentInfoCardProps {
  data: any;
  onEditDate: () => void;
  onEditServices: () => void;
  onWhatsApp: () => void;
}

export const AppointmentInfoCard = ({
  data,
  onEditDate,
  onEditServices,
  onWhatsApp
}: AppointmentInfoCardProps) => {

  const safeServices = Array.isArray(data?.services) ? data.services : [];
  const safeTotal = Number(data?.total) || 0;
  const safePhone = data?.client?.phone || "+55 (00) 00000-0000";
  const safeName = data?.client?.name || "Cliente";

  return (
    <div className="bg-white/[0.02] border border-white/8 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">

      {/* DATA E HORA */}
      <div className="p-7 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#B87333]/10 flex items-center justify-center text-[#D49A62]">
            <Calendar size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#F7EFE2] tracking-tighter leading-none mb-1">
              {data?.date || "--/--/----"}
            </h3>
            <p className="text-[#D49A62] font-black text-xs uppercase tracking-[0.2em]">
              {data?.time || "--:--"}
            </p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onEditDate}
          className="w-11 h-11 bg-white/[0.05] border border-white/8 rounded-xl flex items-center justify-center text-[#F7EFE2]/40 hover:text-[#F7EFE2] transition-all"
        >
          <Edit3 size={18} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* CLIENTE */}
      <div className="p-7 border-b border-white/5">
        <p className="text-[10px] font-black text-[#F7EFE2]/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <User size={12} strokeWidth={3} /> Informações do Cliente
        </p>
        <div className="flex justify-between items-center">
          <div className="flex-1 overflow-hidden mr-4">
            <h3 className="text-3xl font-black text-[#F7EFE2] leading-none mb-2 tracking-tighter truncate">
              {safeName}
            </h3>
            <p className="text-[#F7EFE2]/40 font-bold text-sm tracking-tight">
              {safePhone}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={onWhatsApp}
            className="w-16 h-16 bg-[#B87333] rounded-[1.8rem] flex items-center justify-center text-[#050505] shadow-lg shadow-[#B87333]/20 transition-all"
          >
            <MessageCircle size={28} strokeWidth={2.5} fill="currentColor" />
          </motion.button>
        </div>
      </div>

      {/* SERVIÇOS */}
      <div className="p-7 border-b border-white/5">
        <div className="flex justify-between items-center mb-5">
          <p className="text-[10px] font-black text-[#F7EFE2]/30 uppercase tracking-[0.3em]">Serviços Selecionados</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onEditServices}
            className="text-[10px] font-black text-[#D49A62] uppercase tracking-[0.15em] hover:opacity-70 transition-opacity"
          >
            Alterar
          </motion.button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {safeServices.length > 0 ? (
            safeServices.map((s: any, index: number) => (
              <div key={s.id || index} className="bg-white/[0.04] px-4 py-2.5 rounded-2xl text-[#F7EFE2]/80 font-black text-[11px] border border-white/8 uppercase tracking-tight">
                {s.name}
              </div>
            ))
          ) : (
            <p className="text-[#F7EFE2]/25 text-xs font-bold uppercase">Nenhum serviço</p>
          )}
        </div>
      </div>

      {/* FINANCEIRO */}
      <div className="p-7 bg-white/[0.01] flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2 text-[#F7EFE2]/30">
            <CreditCard size={12} strokeWidth={3} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Total Estimado</p>
          </div>
          <h4 className="text-4xl font-black text-[#F7EFE2] tracking-tighter">
            <span className="text-lg text-[#F7EFE2]/40 mr-1">R$</span>
            {safeTotal.toFixed(2).replace('.',',')}
          </h4>
          <p className="text-[#D49A62]/60 text-[10px] font-black uppercase tracking-widest mt-2">
            PAGAMENTO: {data?.paymentMethod || "Presencial"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20 flex items-center gap-2">
            <CheckCircle2 size={12} className="text-emerald-500" strokeWidth={3} />
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Ativo</p>
          </div>
        </div>
      </div>
    </div>
  );
};
