"use client";

import { useState } from "react";

interface Service {
    id: number;
    name: string;
    price: string;
}

interface SettingsViewProps {
    onBack: () => void;
}

export const SettingsView = ({ onBack }: SettingsViewProps) => {
    // --- ESTADOS DADOS DA EMPRESA ---
    const [isEditingCompany, setIsEditingCompany] = useState(false);
    const [companyData, setCompanyData] = useState({
        name: "InBarber",
        address: "Rua Padre Manuel da Nóbrega, 424 - B4 804",
        city: "Fanny - Curitiba / Paraná",
        phone: "+55 (41) 98518-8245",
    });

    // --- ESTADOS SERVIÇOS ---
    const [services, setServices] = useState<Service[]>([
        { id: 1, name: "Corte", price: "30,00" },
        { id: 2, name: "Barba", price: "20,00" },
        { id: 3, name: "Corte degrade", price: "30,00" }
    ]);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // --- FUNÇÕES ---
    const handleSaveCompany = () => {
        setIsEditingCompany(false);
        console.log("Dados da empresa salvos:", companyData);
    };

    const handleAddService = () => {
        const newService = { id: Date.now(), name: "Novo Serviço", price: "0,00" };
        setServices([...services, newService]);
        setEditingService(newService);
    };

    const handleUpdateService = (id: number, field: keyof Service, value: string) => {
        setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleRemoveService = (id: number) => {
        setServices(services.filter(s => s.id !== id));
        setEditingService(null);
    };

    return (
        <main className="h-[100dvh] w-full flex flex-col bg-background max-w-md mx-auto overflow-hidden animate-in fade-in slide-in-from-right duration-300">

            {/* HEADER */}
            <header className="px-6 pt-12 pb-6 flex items-center justify-between shrink-0">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-white active:scale-90 transition-all"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>

                <button className="bg-white/5 text-white/50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 active:opacity-50 transition-all hover:text-white">
                    Clear Cache
                </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 no-scrollbar pb-20">
                <p className="text-white/40 text-sm font-medium mb-1">Minhas</p>
                <h2 className="text-4xl font-black text-white mb-10 tracking-tight leading-none">Configurações</h2>

                {/* SEÇÃO: DADOS DA EMPRESA */}
                <section className="mb-12 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Dados da Empresa</h3>
                        <button
                            onClick={() => isEditingCompany ? handleSaveCompany() : setIsEditingCompany(true)}
                            className={`text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl transition-all active:scale-95
                                ${isEditingCompany
                                    ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                                    : 'bg-accent text-white shadow-[0_0_15px_rgba(178,123,92,0.2)] hover:brightness-110'
                                }`}
                        >
                            {isEditingCompany ? "Salvar" : "Editar"}
                        </button>
                    </div>

                    {isEditingCompany ? (
                        <div className="space-y-4 animate-in zoom-in-95 duration-200">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-accent uppercase px-1">Nome Fantasia</label>
                                <input
                                    className="w-full bg-surface border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-accent"
                                    value={companyData.name}
                                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-accent uppercase px-1">Endereço Completo</label>
                                <input
                                    className="w-full bg-surface border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-accent text-sm"
                                    value={companyData.address}
                                    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-accent uppercase px-1">WhatsApp / Celular</label>
                                <input
                                    className="w-full bg-surface border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-accent text-sm"
                                    value={companyData.phone}
                                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
                            <h4 className="text-2xl font-bold text-white leading-tight">{companyData.name}</h4>
                            <p className="text-sm text-white/50 leading-relaxed">
                                {companyData.address}<br />
                                {companyData.city}
                            </p>
                            <div className="pt-2">
                                <span className="text-accent font-bold bg-accent/10 px-3 py-1.5 rounded-lg text-sm">{companyData.phone}</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* SEÇÃO: SERVIÇOS */}
                <section className="animate-in fade-in delay-150 duration-500">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Serviços</h3>
                        <button
                            onClick={() => setEditingService(null)}
                            className="text-[11px] font-black text-accent bg-accent/10 px-4 py-1.5 rounded-xl uppercase tracking-widest border border-accent/20"
                        >
                            Gerenciar
                        </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 snap-x pb-4">
                        <button
                            onClick={handleAddService}
                            className="snap-center flex-none w-[65px] h-[160px] rounded-[32px] bg-white/[0.03] border border-dashed border-white/20 flex items-center justify-center text-white active:scale-95 transition-all hover:bg-white/5 group"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </div>
                        </button>

                        {services.map((s) => (
                            <div
                                key={s.id}
                                onClick={() => setEditingService(s)}
                                className={`snap-center flex-none w-[160px] rounded-[32px] p-6 border relative overflow-hidden group active:scale-[0.98] transition-all
                                    ${editingService?.id === s.id ? 'bg-accent border-accent' : 'bg-surface border-white/5'}`}
                            >
                                <div className={`w-10 h-1.5 rounded-full mb-12 ${editingService?.id === s.id ? 'bg-white/40' : 'bg-accent/30'}`}></div>
                                <h5 className="text-white font-bold text-lg leading-tight">{s.name}</h5>
                                <p className={`text-[14px] font-bold mt-1 ${editingService?.id === s.id ? 'text-white/80' : 'text-white/40'}`}>R$ {s.price}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FORMULÁRIO DE EDIÇÃO DE SERVIÇO */}
                {editingService && (
                    <div className="mt-10 p-6 bg-surface border border-white/10 rounded-[32px] animate-in slide-in-from-bottom-6 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-white font-bold">Editar Serviço</h4>
                            <button
                                onClick={() => handleRemoveService(editingService.id)}
                                className="text-[10px] font-black uppercase text-red-500 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20"
                            >
                                Remover
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-accent uppercase px-1">Nome do Serviço</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-accent"
                                    value={editingService.name}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setEditingService({ ...editingService, name: val });
                                        handleUpdateService(editingService.id, 'name', val);
                                    }}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-accent uppercase px-1">Preço (R$)</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-accent"
                                    value={editingService.price}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setEditingService({ ...editingService, price: val });
                                        handleUpdateService(editingService.id, 'price', val);
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => setEditingService(null)}
                                className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest mt-2 active:scale-[0.98] transition-all"
                            >
                                Concluir
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};