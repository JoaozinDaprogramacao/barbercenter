"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, ArrowRight, Percent, Loader2, Pencil, Trash2, AlertTriangle, Package } from "lucide-react";
import { useSession } from "next-auth/react";
import { UpsellRuleModal } from "./UpsellRuleModal"; 

export function UpsellSection({ services }: { services: any[] }) {
    const { data: session } = useSession();
    const barbershopId = (session?.user as any)?.barbershopId;

    const [rules, setRules] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<any>(null);
    
    const [ruleToDelete, setRuleToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchRulesAndProducts = useCallback(async () => {
        if (!barbershopId) return;
        setIsLoading(true);
        try {
            const [rulesRes, productsRes] = await Promise.all([
                fetch(`/api/upsell-rules?barbershopId=${barbershopId}`),
                fetch(`/api/products?barbershopId=${barbershopId}`)
            ]);

            if (rulesRes.ok) {
                const rulesData = await rulesRes.json();
                setRules(rulesData.rules || []);
            }
            if (productsRes.ok) {
                const productsData = await productsRes.json();
                setProducts(productsData.products || []);
            }
        } catch (error) {
            console.error("Erro ao buscar dados", error);
        } finally {
            setIsLoading(false);
        }
    }, [barbershopId]);

    useEffect(() => {
        fetchRulesAndProducts();
    }, [fetchRulesAndProducts]);

    const handleOpenCreate = () => {
        setEditingRule(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (rule: any) => {
        setEditingRule(rule);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (rule: any) => {
        setRuleToDelete(rule);
    };

    const confirmDelete = async () => {
        if (!ruleToDelete) return;
        
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/upsell-rules?id=${ruleToDelete.id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchRulesAndProducts();
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
                                Ofereça descontos automáticos combinando serviços ou produtos e aumente o seu faturamento!
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
                                <div key={rule.id} className="bg-[#0A0A0A] p-4 rounded-[1.5rem] border border-white/5 flex items-center justify-between group hover:border-[#B87333]/40 transition-all shadow-inner relative overflow-hidden">
                                    {rule.hasDownsell && (
                                        <div className="absolute top-0 right-0 bg-[#B87333]/20 text-[#D49A62] text-[7px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
                                            + Downsell
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-[1rem] bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-[#D49A62] group-hover:bg-[#B87333]/10 transition-colors border border-transparent group-hover:border-[#B87333]/30">
                                            {rule.offerProductId ? <Package size={16} strokeWidth={2.5} /> : <Percent size={16} strokeWidth={2.5} />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-[#F7EFE2] flex items-center gap-2">
                                                {rule.triggerName} <ArrowRight size={12} className="text-zinc-600" /> {rule.offerProductId ? rule.offerProductName : rule.offerName}
                                            </p>
                                            <p className="text-[9px] text-[#B87333] font-black uppercase tracking-[0.2em] mt-1.5">
                                                {rule.discountType === 'PERCENTAGE' ? `${rule.discountAmount}% OFF` : `R$ ${rule.discountAmount} OFF`}
                                            </p>
                                        </div>
                                    </div>

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

            <AnimatePresence>
                {isModalOpen && barbershopId && (
                    <UpsellRuleModal 
                        onClose={() => setIsModalOpen(false)} 
                        services={services} 
                        products={products}
                        barbershopId={barbershopId}
                        onSuccess={fetchRulesAndProducts}
                        initialData={editingRule}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {ruleToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] bg-[#050505]/95 backdrop-blur-md flex justify-center items-center p-4"
                    >
                        <motion.div
                            initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-[320px] bg-[#0A0A0A] border border-red-500/20 rounded-[2rem] p-6 sm:p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-2xl rounded-full pointer-events-none" />
                            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner text-red-500">
                                <AlertTriangle size={28} strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-black text-[#F7EFE2] tracking-tight leading-tight mb-2">Excluir Oferta?</h3>
                            <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-8">
                                Você está prestes a excluir a oferta de <strong className="text-zinc-200">{ruleToDelete.triggerName} + {ruleToDelete.offerProductId ? ruleToDelete.offerProductName : ruleToDelete.offerName}</strong>. Essa ação não poderá ser desfeita.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={confirmDelete} disabled={isDeleting}
                                    className="w-full py-3.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-[1.2rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Sim, Excluir Oferta"}
                                </button>
                                <button 
                                    onClick={() => setRuleToDelete(null)} disabled={isDeleting}
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