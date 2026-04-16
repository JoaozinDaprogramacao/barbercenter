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
}: AppointmentInfoCardProps) => (
  <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
    
    {/* DATA E HORA */}
    <div className="p-7 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/20">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-500">
          <Calendar size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white tracking-tighter leading-none mb-1">
            {data.date}
          </h3>
          <p className="text-orange-500 font-black text-xs uppercase tracking-[0.2em]">
            {data.time}
          </p>
        </div>
      </div>
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={onEditDate} 
        className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white transition-all"
      >
        <Edit3 size={18} strokeWidth={2.5} />
      </motion.button>
    </div>

    {/* CLIENTE */}
    <div className="p-7 border-b border-zinc-800/50">
      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
        <User size={12} strokeWidth={3} /> Informações do Cliente
      </p>
      <div className="flex justify-between items-center">
        <div className="flex-1 overflow-hidden mr-4">
          <h3 className="text-3xl font-black text-white leading-none mb-2 tracking-tighter truncate">
            {data.client.name}
          </h3>
          <p className="text-zinc-500 font-bold text-sm tracking-tight">
            {data.client.phone || "+55 (00) 00000-0000"}
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={onWhatsApp} 
          className="w-16 h-16 bg-orange-600 rounded-[1.8rem] flex items-center justify-center text-white shadow-lg shadow-orange-600/20 transition-all"
        >
          <MessageCircle size={28} strokeWidth={2.5} fill="currentColor" className="text-white" />
        </motion.button>
      </div>
    </div>

    {/* SERVIÇOS */}
    <div className="p-7 border-b border-zinc-800/50">
      <div className="flex justify-between items-center mb-5">
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Serviços Selecionados</p>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onEditServices} 
          className="text-[10px] font-black text-orange-500 uppercase tracking-[0.15em] hover:opacity-70 transition-opacity"
        >
          Alterar
        </motion.button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {data.services.map((s: any) => (
          <div key={s.id} className="bg-zinc-950 px-4 py-2.5 rounded-2xl text-zinc-200 font-black text-[11px] border border-zinc-800 uppercase tracking-tight">
            {s.name}
          </div>
        ))}
      </div>
    </div>

    {/* FINANCEIRO */}
    <div className="p-7 bg-zinc-900/40 flex justify-between items-end">
      <div>
        <div className="flex items-center gap-2 mb-2 text-zinc-600">
          <CreditCard size={12} strokeWidth={3} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Total Estimado</p>
        </div>
        <h4 className="text-4xl font-black text-white tracking-tighter">
          <span className="text-lg text-zinc-500 mr-1">R$</span>
          {data.total.toFixed(2).replace('.',',')}
        </h4>
        <p className="text-orange-600/60 text-[10px] font-black uppercase tracking-widest mt-2">
          PAGAMENTO: {data.paymentMethod}
        </p>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className="bg-green-500/10 px-4 py-2 rounded-2xl border border-green-500/20 flex items-center gap-2">
          <CheckCircle2 size={12} className="text-green-500" strokeWidth={3} />
          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Ativo</p>
        </div>
      </div>
    </div>
  </div>
);