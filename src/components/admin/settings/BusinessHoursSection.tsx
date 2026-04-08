"use client";
import { useState } from "react";
import { Clock } from "lucide-react";
import { TimePickerModal } from "./TimePickerModal";

export const BusinessHoursSection = ({ isEditing, isSaving, data, onEdit, onSave, onChange }: any) => {
    // Estado para controlar qual dia e qual campo (abertura/fechamento) estamos editando no modal
    const [pickerConfig, setPickerConfig] = useState<{ index: number, field: 'openTime' | 'closeTime', label: string } | null>(null);

    const updateDay = (dayIndex: number, field: string, value: any) => {
        const newHours = [...data.businessHours];
        newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
        onChange({ ...data, businessHours: newHours });
    };

    return (
        <section className="mb-10 px-1">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Clock size={12} /> Horários
                </h3>
                <button
                    onClick={isEditing ? onSave : onEdit}
                    disabled={isSaving}
                    className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${isEditing ? 'bg-accent text-black' : 'bg-white/5 text-white'
                        }`}
                >
                    {isSaving ? "..." : isEditing ? "Salvar" : "Editar"}
                </button>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden">
                {data.businessHours?.map((item: any, index: number) => (
                    <div key={item.day} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                            {isEditing ? (
                                <button
                                    onClick={() => updateDay(index, 'isOpen', !item.isOpen)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${item.isOpen ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 'bg-white/5 text-white/30'
                                        }`}
                                >
                                    {item.isOpen ? 'Aberto' : 'Fechado'}
                                </button>
                            ) : (
                                <div className={`w-1.5 h-1.5 rounded-full ${item.isOpen ? 'bg-green-500' : 'bg-white/10'}`} />
                            )}
                            <span className={`text-sm font-bold ${item.isOpen ? 'text-white' : 'text-white/30'}`}>{item.label}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {item.isOpen ? (
                                <div className="flex items-center gap-1">
                                    {isEditing ? (
                                        <>
                                            {/* BOTÃO QUE ABRE O MODAL CUSTOMIZADO */}
                                            <button
                                                onClick={() => setPickerConfig({ index, field: 'openTime', label: `Abrir na ${item.label}` })}
                                                className="bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-xl text-[11px] font-black text-white active:bg-white/10"
                                            >
                                                {item.openTime}
                                            </button>
                                            <span className="text-white/10 text-[10px]">/</span>
                                            <button
                                                onClick={() => setPickerConfig({ index, field: 'closeTime', label: `Fechar na ${item.label}` })}
                                                className="bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-xl text-[11px] font-black text-white active:bg-white/10"
                                            >
                                                {item.closeTime}
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-xs font-medium text-white/60">{item.openTime} — {item.closeTime}</span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest mr-2">Descanso</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE SELEÇÃO DE HORA */}
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