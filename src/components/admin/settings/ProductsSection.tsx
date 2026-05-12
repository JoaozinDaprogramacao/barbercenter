"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Package, Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import { maskMoeda } from "@/utils/masks"; // <-- Import da máscara!

export function ProductsSection() {
    const { data: session } = useSession();
    const barbershopId = (session?.user as any)?.barbershopId;

    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Controles de Modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [productToDelete, setProductToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const confirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/products?id=${productToDelete.id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchProducts();
                setProductToDelete(null);
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
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Package size={18} className="text-zinc-400" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-[#F7EFE2] font-black tracking-tight text-sm">Estoque & Produtos</h3>
                            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.25em] mt-0.5">Catálogo de Vendas</p>
                        </div>
                    </div>

                    <button
                        onClick={handleOpenCreate}
                        className="w-10 h-10 rounded-[1.2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#F7EFE2] hover:bg-white/[0.06] transition-all active:scale-90"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="relative z-10">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="animate-spin text-zinc-500" size={28} strokeWidth={2.5} />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-8 px-5 bg-[#0A0A0A] rounded-[1.5rem] border border-white/5 border-dashed shadow-inner">
                            <p className="text-zinc-500 text-xs font-medium mb-3">Você ainda não cadastrou nenhum produto.</p>
                            <button onClick={handleOpenCreate} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
                                + Adicionar Produto
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {products.map((product) => (
                                <div key={product.id} className="bg-[#0A0A0A] p-4 rounded-[1.5rem] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                                    <div>
                                        <p className="text-sm font-bold text-[#F7EFE2]">{product.name}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">R$ {product.price.toFixed(2)}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-zinc-500' : 'text-red-500'}`}>
                                                Estoque: {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-white/5 hover:text-white transition-colors">
                                            <Pencil size={14} strokeWidth={2.5} />
                                        </button>
                                        <button onClick={() => setProductToDelete(product)} className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                                            <Trash2 size={14} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL DE CRIAÇÃO/EDIÇÃO ESTILO BOTTOM SHEET */}
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

            {/* MODAL DE EXCLUSÃO */}
            <AnimatePresence>
                {productToDelete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-[#050505]/95 backdrop-blur-md flex justify-center items-center p-4">
                        <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }} className="w-full max-w-[320px] bg-[#0A0A0A] border border-red-500/20 rounded-[2rem] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                            <div className="w-16 h-16 bg-red-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-red-500">
                                <AlertTriangle size={28} strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-black text-[#F7EFE2] mb-2">Excluir Produto?</h3>
                            <p className="text-zinc-400 text-xs mb-8">Tem certeza que deseja excluir <strong>{productToDelete.name}</strong>?</p>
                            <div className="flex flex-col gap-3">
                                <button onClick={confirmDelete} disabled={isDeleting} className="w-full py-3.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-[1.2rem] font-black uppercase text-[10px] transition-all">
                                    {isDeleting ? "Excluindo..." : "Sim, Excluir"}
                                </button>
                                <button onClick={() => setProductToDelete(null)} disabled={isDeleting} className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-[1.2rem] font-black uppercase text-[10px] transition-all">
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

// Sub-componente do Form do Produto (BOTTOM SHEET COM MÁSCARA)
function ProductBottomSheet({ onClose, barbershopId, onSuccess, initialData }: any) {
    const [name, setName] = useState(initialData?.name || "");
    
    // 🔥 Guardamos o valor bruto (apenas números) no estado
    const [price, setPrice] = useState(
        initialData?.price ? (initialData.price * 100).toFixed(0) : ""
    );
    
    const [stock, setStock] = useState(initialData?.stock || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        const numericPrice = Number(price) / 100; // Converte "3500" para 35.00

        if (!name || !numericPrice) return alert("Preencha o nome e preço válidos!");
        setIsSaving(true);
        try {
            const method = initialData ? 'PUT' : 'POST';
            const bodyPayload: any = { 
                barbershopId, 
                name, 
                price: numericPrice, 
                stock 
            };
            
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

    return (
        <div className="fixed inset-0 z-[200] flex items-end justify-center">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose} 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />

            {/* Bottom Sheet Body */}
            <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-md bg-zinc-950 border-t border-zinc-800 rounded-t-[3rem] px-8 pt-4 pb-12 z-10 will-change-transform"
            >
                {/* Alça de arraste */}
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />

                <div className="flex justify-between items-center mb-8">
                    <h4 className="text-xl font-black text-white tracking-tight uppercase">
                        {initialData ? "Editar" : "Novo"} Produto
                    </h4>
                </div>

                <div className="space-y-6">
                    {/* Nome do Produto */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#B87333] uppercase px-1 tracking-[0.2em]">Nome do Produto</label>
                        <input
                            autoFocus
                            className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-[#B87333]/50 transition-all text-lg font-bold"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Pomada Efeito Matte"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Preço com MÁSCARA */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#B87333] uppercase px-1 tracking-[0.2em]">Preço</label>
                            <input
                                type="tel"
                                className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-[#B87333]/50 transition-all text-lg font-bold"
                                value={maskMoeda(price)}
                                onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
                                placeholder="R$ 0,00"
                            />
                        </div>

                        {/* Estoque */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#B87333] uppercase px-1 tracking-[0.2em]">Estoque</label>
                            <input
                                type="number"
                                className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-[#B87333]/50 transition-all text-lg font-bold"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="10"
                            />
                        </div>
                    </div>

                    {/* Botão Salvar */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] mt-6 transition-all shadow-xl shadow-[#B87333]/10 disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : "Concluir e Salvar"}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}