"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, ArrowRight, Percent, X, Loader2, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";

export function UpsellSection({ services }: { services: any[] }) {
    const { data: session } = useSession();
    const barbershopId = (session?.user as any)?.barbershopId;

    const [rules, setRules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Controles dos Modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<any>(null);
    
    // Controle do Modal de Exclusão
    const [ruleToDelete, setRuleToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchRules = useCallback(async () => {
        if (!barbershopId) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/upsell-rules?barbershopId=${barbershopId}`);
            if (res.ok) {
                const data = await res.json();
                setRules(data.rules || []);
            }
        } catch (error) {
            console.error("Erro ao buscar regras", error);
        } finally {
            setIsLoading(false);
        }
    }, [barbershopId]);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const handleOpenCreate = () => {
        setEditingRule(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (rule: any) => {
        setEditingRule(rule);
        setIsModalOpen(true);
    };

    // Abre o modal de exclusão estilizado
    const handleDeleteClick = (rule: any) => {
        setRuleToDelete(rule);
    };

    // Confirma a exclusão na API
    const confirmDelete = async () => {
        if (!ruleToDelete) return;
        
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/upsell-rules?id=${ruleToDelete.id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchRules();
                setRuleToDelete(null);
            } else {
                alert("Erro ao excluir oferta.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-md relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#B87333]/15 blur-3xl rounded-full pointer-events-none" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D49A62]/20 to-[#B87333]/10 border border-[#B87333]/30 flex items-center justify-center shadow-[0_0_15px_rgba(184,115,51,0.15)]">
                            <Sparkles size={18} className="text-[#D49A62]" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-[#F7EFE2] font-black tracking-tight text-sm">Ofertas Inteligentes</h3>
                            <p className="text-[#B87333] text-[9px] font-black uppercase tracking-[0.25em] mt-0.5">Aumente seu Ticket</p>
                        </div>
                    </div>

                    <button
                        onClick={handleOpenCreate}
                        className="w-10 h-10 rounded-[1.2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#F7EFE2] hover:bg-white/[0.06] hover:border-[#B87333]/40 transition-all active:scale-90"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="relative z-10">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="animate-spin text-[#D49A62]" size={28} strokeWidth={2.5} />
                        </div>
                    ) : rules.length === 0 ? (
                        <div className="text-center py-8 px-5 bg-[#0A0A0A] rounded-[1.5rem] border border-white/5 border-dashed shadow-inner">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <Sparkles size={20} className="text-zinc-600" />
                            </div>
                            <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-5">
                                Ofereça descontos automáticos combinando serviços e aumente o seu faturamento!
                            </p>
                            <button
                                onClick={handleOpenCreate}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D49A62] hover:text-[#B87333] transition-colors"
                            >
                                + Criar Primeira Oferta
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {rules.map((rule) => (
                                <div key={rule.id} className="bg-[#0A0A0A] p-4 rounded-[1.5rem] border border-white/5 flex items-center justify-between group hover:border-[#B87333]/40 transition-all shadow-inner">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-[1rem] bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-[#D49A62] group-hover:bg-[#B87333]/10 transition-colors border border-transparent group-hover:border-[#B87333]/30">
                                            <Percent size={16} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-[#F7EFE2] flex items-center gap-2">
                                                {rule.triggerName} <ArrowRight size={12} className="text-zinc-600" /> {rule.offerName}
                                            </p>
                                            <p className="text-[9px] text-[#B87333] font-black uppercase tracking-[0.2em] mt-1.5">
                                                {rule.discountType === 'PERCENTAGE' ? `${rule.discountAmount}% OFF` : `R$ ${rule.discountAmount} OFF`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Ações: Editar e Excluir */}
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleOpenEdit(rule)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-white/5 hover:text-[#D49A62] transition-colors"
                                        >
                                            <Pencil size={14} strokeWidth={2.5} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(rule)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={14} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL DE CRIAÇÃO E EDIÇÃO */}
            <AnimatePresence>
                {isModalOpen && barbershopId && (
                    <UpsellRuleModal 
                        onClose={() => setIsModalOpen(false)} 
                        services={services} 
                        barbershopId={barbershopId}
                        onSuccess={fetchRules}
                        initialData={editingRule}
                    />
                )}
            </AnimatePresence>

            {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ESTILIZADO */}
            <AnimatePresence>
                {ruleToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] bg-[#050505]/95 backdrop-blur-md flex justify-center items-center p-4"
                    >
                        <motion.div
                            initial={{ y: 20, scale: 0.95 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 20, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-[320px] bg-[#0A0A0A] border border-red-500/20 rounded-[2rem] p-6 sm:p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-2xl rounded-full pointer-events-none" />

                            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner text-red-500">
                                <AlertTriangle size={28} strokeWidth={2} />
                            </div>

                            <h3 className="text-xl font-black text-[#F7EFE2] tracking-tight leading-tight mb-2">
                                Excluir Oferta?
                            </h3>
                            <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-8">
                                Você está prestes a excluir a oferta de <strong className="text-zinc-200">{ruleToDelete.triggerName} + {ruleToDelete.offerName}</strong>. Essa ação não poderá ser desfeita.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="w-full py-3.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-[1.2rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Sim, Excluir Oferta"}
                                </button>
                                <button 
                                    onClick={() => setRuleToDelete(null)}
                                    disabled={isDeleting}
                                    className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 rounded-[1.2rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Sub-componente do Modal de Criação/Edição (Mantido igualzinho)
function UpsellRuleModal({ 
    onClose, 
    services, 
    barbershopId, 
    onSuccess,
    initialData
}: { 
    onClose: () => void; 
    services: any[]; 
    barbershopId: string; 
    onSuccess: () => void;
    initialData?: any; 
}) {
    const [triggerId, setTriggerId] = useState(initialData?.triggerServiceId || "");
    const [offerId, setOfferId] = useState(initialData?.offerServiceId || "");
    const [discount, setDiscount] = useState(initialData?.discountAmount || "");
    const [copy, setCopy] = useState(initialData?.customCopy || "Aproveite o desconto especial e faça também este serviço!");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!triggerId || !offerId || !discount) {
            alert("Preencha os campos de serviço base, oferta e desconto!");
            return;
        }

        setIsSaving(true);
        try {
            const method = initialData ? 'PUT' : 'POST';
            const bodyPayload: any = {
                barbershopId,
                triggerServiceId: triggerId,
                offerServiceId: offerId,
                discountAmount: discount,
                customCopy: copy
            };

            if (initialData) bodyPayload.id = initialData.id;

            const res = await fetch('/api/upsell-rules', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPayload)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                alert(data.error || "Erro ao salvar a oferta.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro de conexão ao tentar salvar.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#050505]/90 backdrop-blur-sm flex justify-center items-end sm:items-center p-4 sm:p-0"
        >
            <motion.div
                initial={{ y: "100%", scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: "100%", scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-md bg-[#050505] border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.2),transparent_60%)] pointer-events-none" />
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div>
                        <h3 className="text-[2rem] font-black text-[#F7EFE2] tracking-tighter leading-none">
                            {initialData ? "Editar Oferta" : "Nova Oferta"}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D49A62] mt-2">Motor de Upsell</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        disabled={isSaving}
                        className="flex w-10 h-10 bg-white/[0.04] border border-white/10 rounded-[1.2rem] items-center justify-center text-zinc-400 hover:text-[#F7EFE2] hover:bg-white/[0.08] transition-all active:scale-90 disabled:opacity-50"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-4">Quando o cliente escolher:</label>
                        <select 
                            value={triggerId} 
                            onChange={(e) => setTriggerId(e.target.value)}
                            disabled={isSaving}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] px-5 py-4 text-[#F7EFE2] text-[13px] font-medium outline-none focus:border-[#B87333]/50 focus:ring-1 focus:ring-[#B87333]/50 appearance-none shadow-inner disabled:opacity-50"
                        >
                            <option value="" disabled>Selecione um serviço base...</option>
                            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center justify-center py-2 relative">
                        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <div className="w-10 h-10 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                            <Plus size={16} className="text-[#D49A62]" strokeWidth={3} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-[#D49A62] uppercase tracking-[0.2em] mb-2 ml-4">Oferecer com desconto:</label>
                        <select 
                            value={offerId} 
                            onChange={(e) => setOfferId(e.target.value)}
                            disabled={isSaving}
                            className="w-full bg-[#0A0A0A] border border-[#B87333]/30 rounded-[1.5rem] px-5 py-4 text-[#F7EFE2] text-[13px] font-medium outline-none focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] appearance-none shadow-[inset_0_0_20px_rgba(184,115,51,0.05)] disabled:opacity-50"
                        >
                            <option value="" disabled>Selecione o serviço extra...</option>
                            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-4">Desconto (%):</label>
                        <input 
                            type="number" 
                            placeholder="Ex: 15"
                            value={discount} 
                            onChange={(e) => setDiscount(e.target.value)}
                            disabled={isSaving}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] px-5 py-4 text-[#F7EFE2] text-[13px] font-medium outline-none focus:border-[#B87333]/50 focus:ring-1 focus:ring-[#B87333]/50 shadow-inner disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-4">Gatilho Mental (Texto):</label>
                        <textarea 
                            rows={2}
                            value={copy} 
                            onChange={(e) => setCopy(e.target.value)}
                            disabled={isSaving}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] px-5 py-4 text-[#F7EFE2] text-[13px] font-medium outline-none focus:border-[#B87333]/50 focus:ring-1 focus:ring-[#B87333]/50 resize-none shadow-inner disabled:opacity-50"
                        />
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full mt-6 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(184,115,51,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : (initialData ? "Salvar Alterações" : "Criar Oferta")}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}