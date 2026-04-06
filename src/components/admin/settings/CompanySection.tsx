import { maskPhone } from "@/utils/masks";

interface CompanySectionProps {
    isEditing: boolean;
    data: { nome: string; endereco: string; cidade: string; telefone: string };
    onEdit: () => void;
    onSave: () => void;
    onChange: (newData: any) => void;
}

export const CompanySection = ({ isEditing, data, onEdit, onSave, onChange }: CompanySectionProps) => {
    // Mapeamento de chaves do objeto para Labels legíveis
    const campos = [
        { chave: 'nome', label: 'Nome Fantasia' },
        { chave: 'endereco', label: 'Endereço' },
        { chave: 'telefone', label: 'Telefone / WhatsApp' }
    ];

    return (
        <section className="mb-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Dados da Empresa</h3>
                <button
                    onClick={isEditing ? onSave : onEdit}
                    className={`text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl transition-all active:scale-95 ${isEditing ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-accent text-white shadow-[0_0_15px_rgba(178,123,92,0.2)]'
                        }`}
                >
                    {isEditing ? "Salvar" : "Editar"}
                </button>
            </div>

            {isEditing ? (
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                    {campos.map((item) => (
                        <div key={item.chave} className="space-y-1">
                            <label className="text-[10px] font-bold text-accent uppercase px-1">{item.label}</label>
                            <input
                                className="w-full bg-surface border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-accent text-sm"
                                // Aplica a máscara se a chave for 'telefone'
                                value={item.chave === 'telefone' ? maskPhone((data as any)[item.chave]) : (data as any)[item.chave]}

                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (item.chave === 'telefone') {
                                        // Remove máscara antes de salvar no estado
                                        const rawValue = val.replace(/\D/g, "");
                                        onChange({ ...data, [item.chave]: rawValue });
                                    } else {
                                        onChange({ ...data, [item.chave]: val });
                                    }
                                }}
                                // Configurações dinâmicas de teclado e placeholder
                                type={item.chave === 'telefone' ? "tel" : "text"}
                                placeholder={item.chave === 'telefone' ? "(00) 00000-0000" : ""}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3 bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
                    <h4 className="text-2xl font-bold text-white leading-tight">{data.nome}</h4>
                    <p className="text-sm text-white/50 leading-relaxed">
                        {data.endereco}<br />
                        {data.cidade}
                    </p>
                    <div className="pt-2">
                        <span className="text-accent font-bold bg-accent/10 px-3 py-1.5 rounded-lg text-sm">
                            {maskPhone(data.telefone)}
                        </span>
                    </div>
                </div>
            )}
        </section>
    );
};