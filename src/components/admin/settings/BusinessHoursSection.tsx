"use client";

import { useState } from "react";
import { Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { TimePickerModal } from "./TimePickerModal";

export const BusinessHoursSection = ({ isEditing, isSaving, data, onEdit, onSave, onChange }: any) => {
  const [pickerConfig, setPickerConfig] = useState<{ index: number, field: 'openTime' | 'closeTime', label: string } | null>(null);

  const updateDay = (dayIndex: number, field: string, value: any) => {
    const newHours = [...data.businessHours];
    newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
    onChange({ ...data, businessHours: newHours });
  };

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <Clock size={12} /> Horários de Operação
        </h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={isEditing ? onSave : onEdit}
          disabled={isSaving}
          className={`text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl transition-all ${
            isEditing ? 'bg-orange-600 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
          }`}
        >
          {isSaving ? "..." : isEditing ? "Salvar" : "Editar"}
        </motion.button>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {data.businessHours?.map((item: any, index: number) => (
          <div key={item.day} className="flex items-center justify-between p-5 border-b border-zinc-800/50 last:border-0 group">
            <div className="flex items-center gap-4">
              {isEditing ? (
                <button
                  onClick={() => updateDay(index, 'isOpen', !item.isOpen)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${item.isOpen ? 'bg-green-600' : 'bg-zinc-800'}`}
                >
                  <motion.div 
                    animate={{ x: item.isOpen ? 26 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              ) : (
                <div className={`w-2 h-2 rounded-full ${item.isOpen ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-zinc-800'}`} />
              )}
              <span className={`text-sm font-black uppercase tracking-tight ${item.isOpen ? 'text-white' : 'text-zinc-600'}`}>
                {item.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {item.isOpen ? (
                <div className="flex items-center gap-1.5">
                  {isEditing ? (
                    <div className="flex items-center bg-zinc-950 rounded-xl p-1 border border-zinc-800">
                      <button
                        onClick={() => setPickerConfig({ index, field: 'openTime', label: `Abrir: ${item.label}` })}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-black text-white hover:bg-zinc-800 transition-colors"
                      >
                        {item.openTime}
                      </button>
                      <span className="text-zinc-800 font-bold mx-0.5">/</span>
                      <button
                        onClick={() => setPickerConfig({ index, field: 'closeTime', label: `Fechar: ${item.label}` })}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-black text-white hover:bg-zinc-800 transition-colors"
                      >
                        {item.closeTime}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-zinc-400 bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800/50">
                      {item.openTime} — {item.closeTime}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest mr-2">Fechado</span>
              )}
            </div>
          </div>
        ))}
      </div>

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