import { maskPhone } from "@/utils/masks";

interface CompanySectionProps {
    isEditing: boolean;
    data: { name: string; address: string; city: string; phone: string };
    onEdit: () => void;
    onSave: () => void;
    onChange: (newData: any) => void;
}

export const CompanySection = ({ isEditing, data, onEdit, onSave, onChange }: CompanySectionProps) => (
    <section className="mb-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Dados da Empresa</h3>
            <button
                onClick={isEditing ? onSave : onEdit}
                className={`text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl transition-all active:scale-95 ${isEditing ? 'bg-green-500 text-black' : 'bg-accent text-white'
                    }`}
            >
                {isEditing ? "Salvar" : "Editar"}
            </button>
        </div>

        {isEditing ? (
            <div className="space-y-4">
                {['name', 'address', 'phone'].map((field) => (
                    <div key={field} className="space-y-1">
                        <label className="text-[10px] font-bold text-accent uppercase px-1">{field}</label>
                        <input
                            className="w-full bg-surface border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-accent text-sm"
                            // Lógica condicional para o VALUE
                            value={field === 'phone' ? maskPhone((data as any)[field]) : (data as any)[field]}

                            // Lógica condicional para o ONCHANGE
                            onChange={(e) => {
                                const val = e.target.value;
                                if (field === 'phone') {
                                    // Se for telefone, limpa a máscara antes de salvar
                                    const rawValue = val.replace(/\D/g, "");
                                    onChange({ ...data, [field]: rawValue });
                                } else {
                                    // Se for outro campo, salva o texto normal
                                    onChange({ ...data, [field]: val });
                                }
                            }}
                            // Abre teclado numérico se for o campo de telefone
                            type={field === 'phone' ? "tel" : "text"}
                            placeholder={field === 'phone' ? "(00) 00000-0000" : ""}
                        />
                    </div>
                ))}
            </div>
        ) : (
            <div className="space-y-3 bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
                <h4 className="text-2xl font-bold text-white leading-tight">{data.name}</h4>
                <p className="text-sm text-white/50 leading-relaxed">{data.address}<br />{data.city}</p>
                <div className="pt-2">
                    <span className="text-accent font-bold bg-accent/10 px-3 py-1.5 rounded-lg text-sm">{data.phone}</span>
                </div>
            </div>
        )}
    </section>
);