"use client";
import { Clock } from "lucide-react";

export const BusinessHoursSection = ({ isEditing, isSaving, data, onEdit, onSave, onChange }: any) => {
    
    const updateDay = (dayIndex: number, field: string, value: any) => {
        const newHours = [...data.businessHours];
        newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
        onChange({ ...data, businessHours: newHours });
    };

    return (
        <section className="mb-10 animate-in fade-in duration-500">
            {/* Header Slim */}
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Clock size={12} /> Horários
                </h3>
                <button
                    onClick={isEditing ? onSave : onEdit}
                    disabled={isSaving}
                    className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all active:scale-95 ${
                        isEditing ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                >
                    {isSaving ? "..." : isEditing ? "Salvar" : "Editar"}
                </button>
            </div>

            {/* Container */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden">
                {data.businessHours?.map((item: any, index: number) => (
                    <div 
                        key={item.day} 
                        className={`flex items-center justify-between p-4 border-b border-white/5 last:border-0 transition-all ${
                            !item.isOpen ? 'bg-transparent' : 'bg-white/[0.01]'
                        }`}
                    >
                        {/* Lado Esquerdo: Status e Dia */}
                        <div className="flex items-center gap-3">
                            {isEditing ? (
                                // Botão de Status (Aberto/Fechado) - Super intuitivo
                                <button
                                    onClick={() => updateDay(index, 'isOpen', !item.isOpen)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${
                                        item.isOpen 
                                        ? 'bg-green-500/20 text-green-500 border border-green-500/20' 
                                        : 'bg-white/5 text-white/30 border border-white/5'
                                    }`}
                                >
                                    {item.isOpen ? 'Aberto' : 'Fechado'}
                                </button>
                            ) : (
                                // Apenas um dot sutil quando não está editando
                                <div className={`w-1.5 h-1.5 rounded-full ${item.isOpen ? 'bg-green-500' : 'bg-white/10'}`} />
                            )}
                            <span className={`text-sm font-bold ${item.isOpen ? 'text-white' : 'text-white/30'}`}>
                                {item.label}
                            </span>
                        </div>

                        {/* Lado Direito: Horários ou Texto de Fechado */}
                        <div className="flex items-center gap-2">
                            {item.isOpen ? (
                                <div className="flex items-center gap-1">
                                    {isEditing ? (
                                        <>
                                            {/* Input Invisível sobre o texto para PWA UX */}
                                            <div className="relative bg-white/5 hover:bg-white/10 border border-white/5 px-2 py-1.5 rounded-xl transition-colors">
                                                <span className="text-[11px] font-black text-white">{item.openTime}</span>
                                                <input 
                                                    type="time" 
                                                    value={item.openTime} 
                                                    onChange={(e) => updateDay(index, 'openTime', e.target.value)} 
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            <span className="text-white/20 text-[10px]">—</span>
                                            <div className="relative bg-white/5 hover:bg-white/10 border border-white/5 px-2 py-1.5 rounded-xl transition-colors">
                                                <span className="text-[11px] font-black text-white">{item.closeTime}</span>
                                                <input 
                                                    type="time" 
                                                    value={item.closeTime} 
                                                    onChange={(e) => updateDay(index, 'closeTime', e.target.value)} 
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-xs font-medium text-white/60 tracking-tight">
                                            {item.openTime} às {item.closeTime}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mr-2">
                                    Descanso
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};