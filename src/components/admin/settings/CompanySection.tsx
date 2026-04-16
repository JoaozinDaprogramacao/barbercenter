"use client";

import { maskPhone } from "@/utils/masks";
import { motion } from "framer-motion";
import { Building2, Save, Edit3 } from "lucide-react";

interface CompanySectionProps {
  isEditing: boolean;
  isSaving: boolean;
  data: { nome: string; endereco: string; telefone: string };
  onEdit: () => void;
  onSave: () => void;
  onChange: (newData: any) => void;
}

export const CompanySection = ({ isEditing, isSaving, data, onEdit, onSave, onChange }: CompanySectionProps) => {
  const campos = [
    { chave: 'nome', label: 'Nome Fantasia', placeholder: "Ex: Barbearia Elite" },
    { chave: 'endereco', label: 'Endereço Completo', placeholder: "Rua, número, bairro..." },
    { chave: 'telefone', label: 'Telefone / WhatsApp', placeholder: "(00) 00000-0000" }
  ];

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <Building2 size={12} /> Dados da Empresa
        </h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={isEditing ? onSave : onEdit}
          disabled={isSaving}
          className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl transition-all disabled:opacity-50 ${
            isEditing 
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
              : 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
          }`}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isEditing ? (
            <><Save size={14} /> Salvar</>
          ) : (
            <><Edit3 size={14} /> Editar</>
          )}
        </motion.button>
      </div>

      {isEditing ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5 bg-zinc-900/50 p-6 rounded-[2.5rem] border border-zinc-800"
        >
          {campos.map((item) => (
            <div key={item.chave} className="space-y-2">
              <label className="text-[10px] font-black text-orange-600 uppercase px-1 tracking-widest">{item.label}</label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-white outline-none focus:border-orange-500/50 transition-all text-sm font-bold placeholder:text-zinc-700"
                value={item.chave === 'telefone' ? maskPhone((data as any)[item.chave]) : (data as any)[item.chave]}
                onChange={(e) => {
                  const val = e.target.value;
                  const rawValue = item.chave === 'telefone' ? val.replace(/\D/g, "") : val;
                  onChange({ ...data, [item.chave]: rawValue });
                }}
                type={item.chave === 'telefone' ? "tel" : "text"}
                placeholder={item.placeholder}
              />
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-900 shadow-2xl relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h4 className="text-3xl font-black text-white tracking-tighter mb-2">
              {data.nome || "Sua Barbearia"}
            </h4>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-[90%]">
              {data.endereco || "Endereço não configurado"}
            </p>
            <div className="mt-6 flex">
              <span className="text-orange-500 font-black bg-orange-600/10 px-4 py-2 rounded-xl text-xs border border-orange-600/20 tracking-tight">
                {data.telefone ? maskPhone(data.telefone) : "Sem contato"}
              </span>
            </div>
          </div>
          <Building2 className="absolute -bottom-6 -right-6 text-white/[0.02] w-32 h-32 rotate-12" />
        </motion.div>
      )}
    </section>
  );
};