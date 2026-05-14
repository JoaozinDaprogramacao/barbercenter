"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight, Percent, Loader2, Pencil, Trash2, AlertTriangle, Package, Zap } from "lucide-react";
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

    useEffect(() => { fetchRulesAndProducts(); }, [fetchRulesAndProducts]);

    const confirmDelete = async () => {
        if (!ruleToDelete) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/upsell-rules?id=${ruleToDelete.id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchRulesAndProducts();
                setRuleToDelete(null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <section className="w-full bg-[#050505]">
            {/* Header de Seção Estilo Ajustes iOS */}
            <div className="flex justify-between items-end px-4 pb-2 pt-8 border-b border-zinc-900">
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Ofertas Configuradas
                </h3>
                <button
                    onClick={() => { setEditingRule(null); setIsModalOpen(true); }}
                    className="text-sm font-semibold text-[#D49A62] active:opacity-50 transition-opacity"
                >
                    Adicionar
                </button>
            </div>

            {/* Lista Estilo Mobile Nativo */}
            <div className="w-full">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin text-zinc-800" size={20} />
                    </div>
                ) : rules.length === 0 ? (
                    <div className="py-12 px-4 text-center">
                        <p className="text-zinc-700 text-sm italic">Nenhuma oferta ativa</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {rules.map((rule) => (
                            <div 
                                key={rule.id} 
                                className="flex items-center justify-between px-4 py-4 border-b border-zinc-900 active:bg-zinc-900 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-10 h-10 shrink-0 bg-zinc-900 flex items-center justify-center text-zinc-400">
                                        {rule.offerProductId ? <Package size={18} /> : <Percent size={18} />}
                                    </div>
                                    
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                            <span className="text-[13px] font-bold text-white truncate">{rule.triggerName}</span>
                                            <ArrowRight size={12} className="text-zinc-700 shrink-0" />
                                            <span className="text-[13px] font-bold text-[#D49A62] truncate">
                                                {rule.offerProductId ? rule.offerProductName : rule.offerName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] text-zinc-500 font-medium">
                                                {rule.discountType === 'PERCENTAGE' ? `${rule.discountAmount}% de desconto` : `R$ ${rule.discountAmount} de desconto`}
                                            </span>
                                            {rule.hasDownsell && (
                                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                            )}
                                            {rule.hasDownsell && (
                                                <span className="text-[10px] text-zinc-600 font-bold uppercase">
                                                    + Downsell
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 ml-4">
                                    <button 
                                        onClick={() => { setEditingRule(rule); setIsModalOpen(true); }}
                                        className="w-8 h-8 flex items-center justify-center text-zinc-500 active:text-white"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setRuleToDelete(rule)}
                                        className="w-8 h-8 flex items-center justify-center text-zinc-500 active:text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modais com Animação Nativa */}
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

            {/* Alerta de Exclusão estilo Mobile */}
            <AnimatePresence>
                {ruleToDelete && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center px-8">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setRuleToDelete(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.05, opacity: 0 }}
                            className="w-full bg-[#1C1C1E] rounded-2xl overflow-hidden relative z-10 text-center shadow-xl"
                        >
                            <div className="p-6">
                                <h4 className="text-white font-semibold text-base">Excluir Oferta</h4>
                                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                                    Deseja realmente remover esta regra de oferta inteligente?
                                </p>
                            </div>
                            <div className="flex border-t border-zinc-800">
                                <button 
                                    onClick={() => setRuleToDelete(null)}
                                    className="flex-1 py-3 text-sm font-medium text-white border-r border-zinc-800 active:bg-zinc-800"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 text-sm font-bold text-red-500 active:bg-zinc-800"
                                >
                                    {isDeleting ? "..." : "Excluir"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}