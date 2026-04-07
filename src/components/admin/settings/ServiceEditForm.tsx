import { maskMoeda } from "@/utils/masks";
import { DurationInput } from "./DurationInput"; // Importe o novo componente

interface ServiceEditFormProps {
    service: any;
    isOpen: boolean;
    onUpdate: (id: any, f: string, v: any) => void;
    onRemove: (id: any) => void;
    onDone: () => void;
}

export const ServiceEditForm = ({ service, isOpen, onUpdate, onRemove, onDone }: ServiceEditFormProps) => {
    if (!service && !isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div onClick={onDone} className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} />

            {/* Bottom Sheet */}
            <div className={`fixed bottom-0 left-0 right-0 z-[70] bg-[#121212] border-t border-white/10 rounded-t-[40px] px-8 pt-4 pb-10 transition-transform duration-500 ease-out max-w-md mx-auto ${isOpen ? "translate-y-0" : "translate-y-full"}`}>
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />

                <div className="flex justify-between items-center mb-8">
                    <h4 className="text-xl font-bold text-white">
                        {String(service?.id).length > 15 ? "Editar" : "Novo"} Serviço
                    </h4>
                    <button
                        onClick={() => onRemove(service?.id)}
                        className="text-[10px] font-black text-red-500 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 active:scale-95 transition-all"
                    >
                        REMOVER
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Input Nome */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase px-1 tracking-widest">Nome do Serviço</label>
                        <input
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-white outline-none focus:border-accent transition-all text-lg font-medium"
                            value={service?.name || ""}
                            onChange={(e) => onUpdate(service.id, 'name', e.target.value)}
                            placeholder="Ex: Corte Degradê"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                        {/* Input Preço */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-accent uppercase px-1 tracking-widest">Preço</label>
                            <input
                                type="tel"
                                className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-white outline-none focus:border-accent transition-all text-lg font-medium"
                                value={maskMoeda(String(service?.price || ""))}
                                onChange={(e) => {
                                    const valorBruto = e.target.value.replace(/\D/g, "");
                                    onUpdate(service.id, 'price', valorBruto);
                                }}
                                placeholder="R$ 0,00"
                            />
                        </div>

                        {/* NOVO INPUT DE DURAÇÃO */}
                        <DurationInput 
                            value={service?.duration || 30} 
                            onChange={(newVal) => onUpdate(service.id, 'duration', newVal)} 
                        />
                    </div>

                    <button
                        onClick={onDone}
                        className="w-full bg-white text-black py-5 rounded-[24px] font-black uppercase tracking-[0.2em] mt-4 active:scale-[0.98] transition-all shadow-xl"
                    >
                        Concluir e Salvar
                    </button>
                </div>
            </div>
        </>
    );
};