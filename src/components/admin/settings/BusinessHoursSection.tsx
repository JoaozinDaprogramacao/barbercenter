"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { TimePickerModal } from "./TimePickerModal";

// Expandindo os campos para suportar a lógica da imagem (turnos antes e depois do almoço)
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

  const renderTimeButton = (item: any, index: number, field: TimeField, defaultTime: string, label: string) => (
    <button
      disabled={!isEditing || !item.isOpen}
      onClick={() => setPickerConfig({ index, field, label: `${label}: ${item.label}` })}
      className={`w-full py-3 rounded-xl text-sm font-semibold tracking-wider transition-all border
        ${item.isOpen 
          ? (isEditing ? 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-100' : 'bg-transparent border-zinc-800 text-zinc-300') 
          : 'bg-zinc-900/30 border-transparent text-zinc-600'
        }
      `}
    >
      {item[field] || defaultTime}
    </button>
  );

  return (
    <section className="mb-12">
      {/* Header  */}
      <div className="flex justify-between items-center mb-10 px-2">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <Clock size={12} /> Horários de Operação
        </h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={isEditing ? onSave : onEdit}
          disabled={isSaving}
          className={`text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl transition-all ${
            isEditing ? 'bg-[#B87333] text-[#F7EFE2]' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
          }`}
        >
          {isSaving ? "..." : isEditing ? "Salvar" : "Editar"}
        </motion.button>
      </div>

      <div className="flex flex-col gap-10">
        {data.businessHours?.map((item: any, index: number) => (
          <div key={item.day} className="flex flex-col gap-4">
            
            {/* Top row: Day label, Divider Line, Status, Toggle */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 shrink-0">
                {item.label}
              </span>
              
              <div className="flex-1 h-[1px] bg-zinc-800"></div>
              
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] font-bold tracking-wider ${item.isOpen ? 'text-green-500' : 'text-zinc-500'}`}>
                  {item.isOpen ? 'ATENDENDO' : 'NÃO ATENDENDO'}
                </span>
                
                {isEditing ? (
                  <button
                    onClick={() => updateDay(index, 'isOpen', !item.isOpen)}
                    className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${
                      item.isOpen ? 'bg-green-500' : 'bg-zinc-300' // Fundo branco/cinza quando desligado (igual a imagem)
                    }`}
                  >
                    <motion.div 
                      animate={{ x: item.isOpen ? 22 : 2 }}
                      className="absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-sm"
                    />
                  </button>
                ) : (
                  <div className={`w-2 h-2 rounded-full ${item.isOpen ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-zinc-800'}`} />
                )}
              </div>
            </div>

            {/* Bottom row: Time Slots & Bracket Labels */}
            <div className={`transition-opacity duration-300 ${!item.isOpen ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {renderTimeButton(item, index, 'openTime', '09:00', 'Início')}
                {renderTimeButton(item, index, 'lunchStart', '12:00', 'Saída Almoço')}
                {renderTimeButton(item, index, 'lunchEnd', '13:00', 'Volta Almoço')}
                {renderTimeButton(item, index, 'closeTime', '18:00', 'Fim')}
              </div>
              
              {/* Labels under the inputs (INÍCIO, ALMOÇO, FIM) */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-1 relative">
                <div className="text-center text-[9px] font-bold text-zinc-600 uppercase tracking-widest pt-2">
                  Início
                </div>
                
                {/* Construção visual do Bracket "└─ ALMOÇO ─┘" */}
                <div className="col-span-2 relative flex flex-col items-center justify-start pt-2">
                  <div className="absolute top-0 w-[60%] sm:w-[70%] h-2 border-b border-l border-r border-zinc-800 rounded-b-sm"></div>
                  {/* Nota: Troque 'bg-[#09090B]' para a exata cor de fundo do seu app para cortar a linha perfeitamente */}
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest bg-[#09090B] px-2 z-10 -mt-[6px] relative">
                    Almoço
                  </span>
                </div>
                
                <div className="text-center text-[9px] font-bold text-zinc-600 uppercase tracking-widest pt-2">
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
    </section>
  );
};