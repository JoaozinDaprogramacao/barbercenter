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
                <p className="text-orange-600/60 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <Scissors size={12} /> Procedimento
                </p>
                <h3 className="text-3xl font-black text-white tracking-tighter">Editar Serviços</h3>
            </div>
            <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 no-scrollbar">
                {services.map((s: any) => {
                    const isSelected = selectedIds.includes(s.id);
                    return (
                        <motion.button 
                            key={s.id} 
                            whileTap={{ scale: 0.98 }} 
                            onClick={() => toggleService(s.id)} 
                            className={`w-full flex justify-between items-center p-6 rounded-[2rem] border-2 transition-all ${isSelected ? "bg-orange-600/10 border-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.1)]" : "bg-zinc-900 border-zinc-800 opacity-60"}`}
                        >
                            <div className="text-left">
                                <span className={`block font-black uppercase text-xs tracking-tight ${isSelected ? "text-orange-500" : "text-white"}`}>{s.name}</span>
                                <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1 block">R$ {s.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-orange-600 bg-orange-600" : "border-zinc-800"}`}>
                                {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}