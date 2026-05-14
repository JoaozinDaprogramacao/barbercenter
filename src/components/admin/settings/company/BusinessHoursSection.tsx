"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { TimePickerModal } from "../services/TimePickerModal";

type TimeField = 'openTime' | 'lunchStart' | 'lunchEnd' | 'closeTime';

interface PickerConfig {
  index: number;
  field: TimeField;
  label: string;
}

export const BusinessHoursSection = ({ isEditing, isSaving, data, onEdit, onSave, onChange }: any) => {
  const [pickerConfig, setPickerConfig] = useState<PickerConfig | null>(null);

  const updateDay = (dayIndex: number, field: string, value: any) => {
    const newHours = [...data.businessHours];
    newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
    onChange({ ...data, businessHours: newHours });
  };

  const renderTimeButton = (item: any, index: number, field: TimeField, defaultTime: string) => (
    <button
      disabled={!isEditing || !item.isOpen}
      onClick={() => setPickerConfig({ index, field, label: item.label })}
      className={`w-full py-2.5 rounded-lg text-[13px] font-semibold tracking-wider transition-all border
        ${item.isOpen
          ? (isEditing ? 'bg-[#111111] hover:bg-zinc-900 border-zinc-800/80 text-zinc-300' : 'bg-[#111111] border-zinc-800/80 text-zinc-400')
          : 'bg-[#0A0A0A] border-transparent text-zinc-700'
        }
      `}
    >
      {item[field] || defaultTime}
    </button>
  );

  return (
    <>
      <div className={`w-full flex flex-col flex-1 ${isEditing ? 'pb-24' : 'pb-10'}`}>

        {/* HEADER DA SEÇÃO */}
        <div className="flex justify-between items-end px-5 pb-4">
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-5">
            Configurar Horários
          </h3>

          {/* Se NÃO estiver editando, mostra o botão "Alterar" no topo */}
          {!isEditing && (
            <button
              onClick={onEdit}
              className="text-sm font-bold text-[#D49A62] active:opacity-50 transition-all"
            >
              Alterar
            </button>
          )}
        </div>

        {/* LISTA DE DIAS COM O LAYOUT DA IMAGEM */}
        <div className="w-full bg-[#050505]">
          {data.businessHours?.map((item: any, index: number) => (
            <div key={item.day} className="flex flex-col px-4 py-5 border-b border-zinc-900/60 last:border-0 gap-4">

              {/* Linha Superior: Dia ------ Atendendo [Toggle] */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 shrink-0">
                  {item.label}
                </span>

                <div className="flex-1 h-[1px] bg-zinc-900"></div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[9px] font-bold tracking-widest uppercase ${item.isOpen ? 'text-green-500' : 'text-zinc-600'}`}>
                    {item.isOpen ? 'Atendendo' : 'Não Atendendo'}
                  </span>

                  {isEditing ? (
                    <button
                      onClick={() => updateDay(index, 'isOpen', !item.isOpen)}
                      className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${item.isOpen ? 'bg-green-500' : 'bg-white/10'
                        }`}
                    >
                      <motion.div
                        animate={{ x: item.isOpen ? 22 : 2 }}
                        className="absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${item.isOpen ? 'bg-green-500' : 'bg-zinc-800'}`} />
                  )}
                </div>
              </div>

              {/* Linha Inferior: Caixas de Horário e Legendas */}
              <div className={`transition-opacity duration-300 ${!item.isOpen ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>

                {/* Grid das 4 caixas */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {renderTimeButton(item, index, 'openTime', '09:00')}
                  {renderTimeButton(item, index, 'lunchStart', '12:00')}
                  {renderTimeButton(item, index, 'lunchEnd', '13:00')}
                  {renderTimeButton(item, index, 'closeTime', '18:00')}
                </div>

                {/* Legendas com a Chave de Almoço */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-1.5 relative">
                  <div className="text-center text-[8px] font-black text-zinc-600 uppercase tracking-widest pt-1">
                    Início
                  </div>

                  {/* Chave de Almoço └─ ALMOÇO ─┘ */}
                  <div className="col-span-2 relative flex flex-col items-center justify-start pt-1">
                    <div className="absolute top-0 w-[65%] h-1.5 border-b border-l border-r border-zinc-800/80 rounded-b-[2px]"></div>
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest bg-[#050505] px-1.5 z-10 -mt-[4px] relative">
                      Almoço
                    </span>
                  </div>

                  <div className="text-center text-[8px] font-black text-zinc-600 uppercase tracking-widest pt-1">
                    Fim
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Modal Picker */}
        {pickerConfig && (
          <TimePickerModal
            isOpen={!!pickerConfig}
            label={pickerConfig.label}
            currentValue={data.businessHours[pickerConfig.index][pickerConfig.field]}
            onClose={() => setPickerConfig(null)}
            onSelect={(newTime: string) => updateDay(pickerConfig.index, pickerConfig.field, newTime)}
          />
        )}
      </div>

      {/* BOTÃO FIXO NO RODAPÉ (Com a Identidade do BarberCenter) */}
      {isEditing && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
          {/* Sombra escura (shadow-[0_-10px_40px_rgba(5,5,5,0.9)]) para criar profundidade e separar do conteúdo */}
          <div className="bg-[#050505]/90 backdrop-blur-md pt-4 pb-6 px-6 shadow-[0_-20px_40px_rgba(5,5,5,0.95)]">
            <button
              onClick={onSave}
              disabled={isSaving}
              className="w-full bg-[#D49A62] text-[#050505] py-4 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] transition-all flex justify-center items-center active:scale-[0.98] active:bg-[#B87333] disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={20} className="animate-spin" /> : "Salvar Alterações"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};