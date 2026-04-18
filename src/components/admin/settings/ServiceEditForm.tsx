"use client";

import { motion, AnimatePresence } from "framer-motion";
import { maskMoeda } from "@/utils/masks";
import { DurationInput } from "./DurationInput";

interface ServiceEditFormProps {
    service: any;
    isOpen: boolean;
    isSaving: boolean;
    onUpdate: (id: any, f: string, v: any) => void;
    onRemove: (id: any) => void;
    onDone: () => void;
}

export const ServiceEditForm = ({ 
    service, 
    isOpen, 
    isSaving,
    onUpdate, 
    onRemove, 
    onDone 
}: ServiceEditFormProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onDone} 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                    />

                    {/* Bottom Sheet Body */}
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-md bg-zinc-950 border-t border-zinc-800 rounded-t-[3rem] px-8 pt-4 pb-12 z-10 will-change-transform"
                    >
                        {/* Alça de arraste */}
                        <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />

                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-xl font-black text-white tracking-tight uppercase">
                                {String(service?.id).length > 15 ? "Editar" : "Novo"} Serviço
                            </h4>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onRemove(service?.id)}
                                className="text-[10px] font-black text-red-500 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 active:bg-red-500/20 transition-all uppercase tracking-widest"
                            >
                                Remover
                            </motion.button>
                        </div>

                        <div className="space-y-6">
                            {/* Nome */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-orange-600 uppercase px-1 tracking-[0.2em]">Nome do Serviço</label>
                                <input
                                    autoFocus
                                    className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-orange-500/50 transition-all text-lg font-bold"
                                    value={service?.name || ""}
                                    onChange={(e) => onUpdate(service.id, 'name', e.target.value)}
                                    placeholder="Ex: Corte e Barba"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                                {/* Preço */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-orange-600 uppercase px-1 tracking-[0.2em]">Preço</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-orange-500/50 transition-all text-lg font-bold"
                                        value={maskMoeda(String(service?.price || ""))}
                                        onChange={(e) => {
                                            const valorBruto = e.target.value.replace(/\D/g, "");
                                            onUpdate(service.id, 'price', valorBruto);
                                        }}
                                        placeholder="R$ 0,00"
                                    />
                                </div>

                                {/* Duração */}
                                <DurationInput 
                                    value={service?.duration || 30} 
                                    onChange={(newVal) => onUpdate(service.id, 'duration', newVal)} 
                                />
                            </div>

                            {/* Botão Salvar */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onDone}
                                className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] mt-6 transition-all shadow-xl shadow-orange-600/5"
                            >
                                Concluir e Salvar
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};