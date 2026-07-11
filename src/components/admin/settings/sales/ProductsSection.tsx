"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronRight, Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { maskMoeda } from "@/utils/masks";

const getInitials = (name: string) => {
    if (!name) return "PR";
    const words = name.trim().split(" ").filter(w => w.length > 0);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

export function ProductsSection() {
    const { data: session } = useSession();
    const barbershopId = (session?.user as any)?.barbershopId;

    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const fetchProducts = useCallback(async () => {
        if (!barbershopId) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/products?barbershopId=${barbershopId}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error("Erro ao buscar produtos", error);
        } finally {
            setIsLoading(false);
        }
    }, [barbershopId]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product: any) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full flex flex-col">
            
            <div className="flex justify-between items-end px-6 pb-4 pt-6">
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                    Estoque e Vendas
                </h3>
            </div>

            <div className="w-full px-5 space-y-3">
                
                <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOpenCreate}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-[#B87333]/30 bg-[#B87333]/5 hover:bg-[#B87333]/10 transition-colors group"
                >
                    <div className="w-12 h-12 rounded-xl bg-[#D49A62]/10 flex items-center justify-center text-[#D49A62] group-hover:scale-110 transition-transform">
                        <Plus size={24} strokeWidth={2.5} />
                    </div>
                    <div className="text-left">
                        <h4 className="text-[#D49A62] font-bold text-[15px]">Adicionar Produto</h4>
                        <p className="text-[#D49A62]/60 text-[12px] font-medium mt-0.5">Pomadas, óleos, bebidas...</p>
                    </div>
                </motion.button>

                {isLoading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-[#D49A62]" size={28} />
                    </div>
                )}

                {!isLoading && products.map((product, index) => {
                    const initials = getInitials(product.name);
                    const inStock = product.stock > 0;
                    
                    return (
                        <motion.button 
                            key={product.id} 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOpenEdit(product)}
                            className="w-full flex items-center justify-between p-4 rounded-2xl border bg-[#0A0A0A] border-zinc-800/80 hover:border-zinc-700 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-white transition-colors shadow-inner">
                                    <span className="font-black text-[15px] tracking-wider">{initials}</span>
                                </div>

                                <div className="text-left flex flex-col justify-center">
                                    <span className="text-[15px] font-bold text-white tracking-tight">
                                        {product.name}
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            Estoque: {product.stock}
                                        </span>
                                        {!!product.commissionValue && (
                                            <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-[#B87333]/10 text-[#D49A62]">
                                                {product.commissionType === "FIXED"
                                                    ? `Comissão: R$ ${product.commissionValue.toFixed(2).replace('.', ',')}`
                                                    : `Comissão: ${product.commissionValue}%`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 font-black text-[13px] tracking-wide">
                                    R$ {product.price.toFixed(2).replace('.', ',')}
                                </div>
                                <ChevronRight size={18} className="text-zinc-700" />
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence>
                {isModalOpen && barbershopId && (
                    <ProductBottomSheet 
                        onClose={() => setIsModalOpen(false)} 
                        barbershopId={barbershopId}
                        onSuccess={fetchProducts}
                        initialData={editingProduct}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ProductBottomSheet({ onClose, barbershopId, onSuccess, initialData }: any) {
    const [name, setName] = useState(initialData?.name || "");
    const [price, setPrice] = useState(initialData?.price ? (initialData.price * 100).toFixed(0) : "");
    const [stock, setStock] = useState(initialData?.stock || "");
    const [commissionType, setCommissionType] = useState<"PERCENTAGE" | "FIXED">(initialData?.commissionType === "FIXED" ? "FIXED" : "PERCENTAGE");
    const [commissionPercent, setCommissionPercent] = useState(
        initialData?.commissionValue && initialData?.commissionType !== "FIXED" ? String(initialData.commissionValue) : ""
    );
    const [commissionFixedCents, setCommissionFixedCents] = useState(
        initialData?.commissionValue && initialData?.commissionType === "FIXED" ? (initialData.commissionValue * 100).toFixed(0) : ""
    );

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleSave = async () => {
        const numericPrice = Number(price) / 100;
        const numericCommission = commissionType === "FIXED"
            ? Number(commissionFixedCents) / 100
            : Number(commissionPercent) || 0;

        if (!name || !numericPrice) return alert("Preencha o nome e preço válidos!");
        setIsSaving(true);
        try {
            const method = initialData ? 'PUT' : 'POST';
            const bodyPayload: any = { barbershopId, name, price: numericPrice, stock, commissionType, commissionValue: numericCommission };
            if (initialData) bodyPayload.id = initialData.id;

            const res = await fetch('/api/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPayload)
            });

            if (res.ok) { onSuccess(); onClose(); }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/products?id=${initialData.id}`, { method: 'DELETE' });
            if (res.ok) { onSuccess(); onClose(); }
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end justify-center font-sans">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} 
                className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm" 
            />

            <motion.div 
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-md bg-[#0A0A0A] border-t border-zinc-800 rounded-t-[2rem] px-6 pt-4 pb-10 z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 shrink-0" />

                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h4 className="text-lg font-black text-white tracking-tight uppercase">
                        {initialData ? "Editar Produto" : "Novo Produto"}
                    </h4>
                    <button onClick={onClose} className="text-zinc-500 font-bold text-sm">Cancelar</button>
                </div>

                <div className="overflow-y-auto no-scrollbar pb-6 space-y-4">
                    <div className="w-full bg-[#111111] border border-zinc-900 rounded-2xl overflow-hidden">
                        
                        <div className="flex flex-col px-4 py-3 border-b border-zinc-900/50">
                            <label className="text-[10px] font-black text-[#B87333] uppercase tracking-widest">Produto</label>
                            <input
                                autoFocus
                                className="w-full bg-transparent text-white text-[16px] font-semibold outline-none mt-1 placeholder:text-zinc-700"
                                value={name} onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Pomada Efeito Matte"
                            />
                        </div>
                        
                        <div className="flex flex-col px-4 py-3 border-b border-zinc-900/50">
                            <label className="text-[10px] font-black text-[#B87333] uppercase tracking-widest">Preço de Venda</label>
                            <input
                                type="tel"
                                className="w-full bg-transparent text-white text-[16px] font-semibold outline-none mt-1 placeholder:text-zinc-700"
                                value={maskMoeda(price)} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
                                placeholder="R$ 0,00"
                            />
                        </div>

                        <div className="flex flex-col px-4 py-3 border-b border-zinc-900/50">
                            <label className="text-[10px] font-black text-[#B87333] uppercase tracking-widest">Estoque Atual</label>
                            <input
                                type="number"
                                className="w-full bg-transparent text-white text-[16px] font-semibold outline-none mt-1 placeholder:text-zinc-700"
                                value={stock} onChange={(e) => setStock(e.target.value)}
                                placeholder="Quantidade em unidades"
                            />
                        </div>

                        <div className="flex flex-col px-4 py-3">
                            <label className="text-[10px] font-black text-[#B87333] uppercase tracking-widest">Comissão</label>
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setCommissionType("PERCENTAGE")}
                                    className={`flex-1 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors ${commissionType === "PERCENTAGE" ? "bg-[#D49A62] text-[#050505]" : "bg-zinc-900 text-zinc-500"}`}
                                >
                                    Percentual
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCommissionType("FIXED")}
                                    className={`flex-1 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors ${commissionType === "FIXED" ? "bg-[#D49A62] text-[#050505]" : "bg-zinc-900 text-zinc-500"}`}
                                >
                                    Valor Fixo
                                </button>
                            </div>
                            <input
                                type="tel"
                                className="w-full bg-transparent text-white text-[16px] font-semibold outline-none mt-3 placeholder:text-zinc-700"
                                value={commissionType === "FIXED" ? maskMoeda(commissionFixedCents) : commissionPercent}
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, "");
                                    if (commissionType === "FIXED") setCommissionFixedCents(digits);
                                    else setCommissionPercent(digits);
                                }}
                                placeholder={commissionType === "FIXED" ? "R$ 0,00 por unidade vendida" : "0% sobre o valor de venda"}
                            />
                        </div>

                    </div>

                    <button
                        onClick={handleSave} disabled={isSaving}
                        className="w-full bg-[#D49A62] text-[#050505] py-4 rounded-xl font-black text-[13px] uppercase tracking-[0.2em] transition-all flex justify-center items-center active:scale-[0.98] mt-2"
                    >
                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : "Salvar Produto"}
                    </button>

                    {initialData && (
                        <div className="pt-6">
                            {!confirmDelete ? (
                                <button 
                                    onClick={() => setConfirmDelete(true)}
                                    className="w-full py-4 text-red-500 font-bold text-[14px] bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-colors flex justify-center items-center gap-2"
                                >
                                    <Trash2 size={16} /> Apagar Produto
                                </button>
                            ) : (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex flex-col items-center text-center">
                                    <AlertTriangle size={24} className="text-red-500 mb-2" />
                                    <p className="text-zinc-300 text-[13px] mb-4">
                                        Isso irá excluir <strong>{name}</strong> permanentemente do seu estoque.
                                    </p>
                                    <div className="flex w-full gap-3">
                                        <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 bg-white/5 text-zinc-300 rounded-lg font-bold text-xs">
                                            Cancelar
                                        </button>
                                        <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-3 bg-red-500 text-white rounded-lg font-bold text-xs">
                                            {isDeleting ? "Apagando..." : "Sim, Apagar"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </motion.div>
        </div>
    );
}