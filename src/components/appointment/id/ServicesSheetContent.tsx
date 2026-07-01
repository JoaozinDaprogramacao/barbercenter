import { motion } from "framer-motion";
import { Scissors, Check } from "lucide-react";

interface ServicesSheetContentProps {
    selectedIds: string[];
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
    services: any[];
}

export function ServicesSheetContent({ selectedIds, setSelectedIds, services }: ServicesSheetContentProps) {
    const toggleService = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="space-y-8 py-4">
            <div className="space-y-2">
                <p className="text-[#D49A62]/70 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <Scissors size={12} /> Procedimento
                </p>
                <h3 className="text-3xl font-black text-[#F7EFE2] tracking-tighter">Editar Serviços</h3>
            </div>
            <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 no-scrollbar">
                {services.map((s: any) => {
                    const isSelected = selectedIds.includes(s.id);
                    return (
                        <motion.button
                            key={s.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleService(s.id)}
                            className={`w-full flex justify-between items-center p-6 rounded-[2rem] border-2 transition-all ${
                                isSelected
                                    ? "bg-[#B87333]/10 border-[#B87333] shadow-[0_0_20px_rgba(184,115,51,0.1)]"
                                    : "bg-white/[0.03] border-white/8 opacity-60"
                            }`}
                        >
                            <div className="text-left">
                                <span className={`block font-black uppercase text-xs tracking-tight ${isSelected ? "text-[#D49A62]" : "text-[#F7EFE2]"}`}>
                                    {s.name}
                                </span>
                                <span className="text-[10px] text-[#F7EFE2]/35 font-bold uppercase mt-1 block">
                                    R$ {s.price.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected ? "border-[#B87333] bg-[#B87333]" : "border-white/15"
                            }`}>
                                {isSelected && <Check size={14} className="text-[#050505]" strokeWidth={4} />}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
