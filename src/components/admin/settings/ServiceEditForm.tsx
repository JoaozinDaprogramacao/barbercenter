import { maskMoeda } from "@/utils/masks";

interface ServiceEditFormProps {
    service: any;
    isOpen: boolean;
    onUpdate: (id: number, f: string, v: string) => void;
    onRemove: (id: number) => void;
    onDone: () => void;
}

export const ServiceEditForm = ({ service, isOpen, onUpdate, onRemove, onDone }: ServiceEditFormProps) => {
    if (!service && !isOpen) return null;

    return (
        <>
            {/* OVERLAY (Fundo escuro que fecha ao clicar) */}
            <div
                onClick={onDone}
                className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* BOTTOM SHEET CONTAINER */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-[70] bg-[#121212] border-t border-white/10 rounded-t-[40px] px-8 pt-4 pb-10 transition-transform duration-500 ease-out max-w-md mx-auto ${isOpen ? "translate-y-0" : "translate-y-full"
                    }`}
            >
                {/* HANDLE (A barrinha de puxar visual) */}
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />

                <div className="flex justify-between items-center mb-8">
                    <h4 className="text-xl font-bold text-white">Editar Serviço</h4>
                    <button
                        onClick={() => onRemove(service?.id)}
                        className="text-[10px] font-black text-red-500 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 active:scale-95 transition-all"
                    >
                        REMOVER
                    </button>
                </div>

                <div className="space-y-6">
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
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase px-1 tracking-widest">
                            Preço do Serviço
                        </label>
                        <input
                            type="tel" // Mantém teclado numérico no celular
                            className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-white outline-none focus:border-accent transition-all text-lg font-medium"
                            // Aplica a máscara no valor que vem do estado
                            value={maskMoeda(service?.price || "")}
                            onChange={(e) => {
                                // Pega apenas os números digitados
                                const valorBruto = e.target.value.replace(/\D/g, "");
                                // Atualiza o estado apenas com os números (ex: "3000" para 30,00)
                                onUpdate(service.id, 'price', valorBruto);
                            }}
                            placeholder="R$ 0,00"
                        />
                    </div>

                    <button
                        onClick={onDone}
                        className="w-full bg-white text-black py-5 rounded-[24px] font-black uppercase tracking-[0.2em] mt-4 active:scale-[0.98] transition-all shadow-xl"
                    >
                        Concluir
                    </button>
                </div>
            </div>
        </>
    );
};