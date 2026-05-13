"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2, AlertTriangle } from "lucide-react";

export function UpsellRuleModal({ 
    onClose, services, products, barbershopId, onSuccess, initialData
}: any) {
    const [triggerId, setTriggerId] = useState(initialData?.triggerServiceId || "");
    const [offerType, setOfferType] = useState<'SERVICE' | 'PRODUCT'>(initialData?.offerProductId ? 'PRODUCT' : 'SERVICE');
    const [offerId, setOfferId] = useState(initialData?.offerServiceId || initialData?.offerProductId || "");
    const [discount, setDiscount] = useState(initialData?.discountAmount || "");
    const [copy, setCopy] = useState(initialData?.customCopy || "Aproveite o desconto especial!");
    
    const hasInitialDownsell = !!initialData?.downsellOfferProductId || !!initialData?.downsellOfferServiceId;
    const [enableDownsell, setEnableDownsell] = useState(hasInitialDownsell);
    const [downsellType, setDownsellType] = useState<'SERVICE' | 'PRODUCT'>(initialData?.downsellOfferProductId ? 'PRODUCT' : 'SERVICE');
    const [downsellId, setDownsellId] = useState(initialData?.downsellOfferServiceId || initialData?.downsellOfferProductId || "");
    const [downsellDiscount, setDownsellDiscount] = useState(initialData?.downsellDiscountAmount || "");
    const [downsellCopy, setDownsellCopy] = useState(initialData?.downsellCustomCopy || "Última chance! Leve este item com um super desconto.");

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { setOfferId(""); }, [offerType]);
    useEffect(() => { setDownsellId(""); }, [downsellType]);

    const handleSave = async () => {
        if (!triggerId || !offerId || !discount) {
            alert("Preencha os campos base do Upsell!");
            return;
        }

        if (enableDownsell && (!downsellId || !downsellDiscount)) {
            alert("Preencha todos os campos do Downsell ou desative a opção.");
            return;
        }

        setIsSaving(true);
        try {
            const method = initialData ? 'PUT' : 'POST';
            const bodyPayload: any = {
                barbershopId,
                triggerServiceId: triggerId,
                discountAmount: discount,
                customCopy: copy,
                offerServiceId: offerType === 'SERVICE' ? offerId : null,
                offerProductId: offerType === 'PRODUCT' ? offerId : null,
                hasDownsell: enableDownsell,
                downsellOfferServiceId: enableDownsell && downsellType === 'SERVICE' ? downsellId : null,
                downsellOfferProductId: enableDownsell && downsellType === 'PRODUCT' ? downsellId : null,
                downsellDiscountAmount: enableDownsell ? downsellDiscount : null,
                downsellCustomCopy: enableDownsell ? downsellCopy : null,
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
            alert("Erro de conexão.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[200] bg-[#050505]/90 backdrop-blur-sm"
            />

            <div className="fixed inset-0 z-[200] flex flex-col justify-end pointer-events-none">
                <motion.div
                    initial={{ y: "100%" }} 
                    animate={{ y: 0 }} 
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full max-w-md mx-auto bg-[#050505] border-t border-x border-white/10 rounded-t-[2.5rem] p-6 sm:p-8 relative shadow-[0_-20px_60px_rgba(0,0,0,0.8)] pointer-events-auto max-h-[90dvh] flex flex-col overflow-hidden"
                >
                    <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 shrink-0 relative z-20" />

                    <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.2),transparent_60%)] pointer-events-none z-0" />
                    
                    <div className="flex justify-between items-center mb-6 relative z-10 shrink-0">
                        <div>
                            <h3 className="text-[1.8rem] font-black text-[#F7EFE2] tracking-tighter leading-none">
                                {initialData ? "Editar Oferta" : "Nova Oferta"}
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D49A62] mt-2">Motor de Conversão</p>
                        </div>
                        <button 
                            onClick={onClose} disabled={isSaving}
                            className="flex w-10 h-10 bg-white/[0.04] border border-white/10 rounded-[1.2rem] items-center justify-center text-zinc-400 hover:text-[#F7EFE2] transition-all active:scale-90"
                        >
                            <X size={20} strokeWidth={2.5} />
                        </button>
                    </div>

                    <div className="space-y-4 relative z-10 overflow-y-auto no-scrollbar pr-2 pb-4 flex-1">
                        <div className="bg-white/[0.02] p-4 rounded-[1.5rem] border border-white/5">
                            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">1. Gatilho (Quando o cliente escolher...)</label>
                            <select 
                                value={triggerId} onChange={(e) => setTriggerId(e.target.value)} disabled={isSaving}
                                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-[#F7EFE2] text-xs font-medium outline-none appearance-none"
                            >
                                <option value="" disabled>Selecione um serviço...</option>
                                {services.map((s:any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="bg-[#B87333]/5 p-4 rounded-[1.5rem] border border-[#B87333]/20">
                            <label className="block text-[9px] font-black text-[#D49A62] uppercase tracking-[0.2em] mb-3">2. Oferta Principal (Upsell)</label>
                            
                            <div className="flex bg-[#0A0A0A] border border-white/10 rounded-xl p-1 mb-3">
                                <button onClick={() => setOfferType('SERVICE')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${offerType === 'SERVICE' ? 'bg-white/10 text-[#F7EFE2]' : 'text-zinc-500'}`}>Serviço</button>
                                <button onClick={() => setOfferType('PRODUCT')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${offerType === 'PRODUCT' ? 'bg-white/10 text-[#F7EFE2]' : 'text-zinc-500'}`}>Produto</button>
                            </div>

                            <select value={offerId} onChange={(e) => setOfferId(e.target.value)} disabled={isSaving} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-[#F7EFE2] text-xs font-medium outline-none appearance-none mb-3">
                                <option value="" disabled>O que você vai oferecer?</option>
                                {offerType === 'SERVICE' ? services.map((s:any) => <option key={s.id} value={s.id}>{s.name}</option>) : products.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>

                            <div className="flex gap-3 mb-3">
                                <div className="flex-1">
                                    <input type="number" placeholder="Desc. %" value={discount} onChange={(e) => setDiscount(e.target.value)} disabled={isSaving} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-[#F7EFE2] text-xs font-medium outline-none" />
                                </div>
                            </div>

                            <textarea rows={2} placeholder="Copy (Texto persuasivo)" value={copy} onChange={(e) => setCopy(e.target.value)} disabled={isSaving} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-[#F7EFE2] text-xs font-medium outline-none resize-none" />
                        </div>

                        <div className="bg-white/[0.02] p-4 rounded-[1.5rem] border border-white/5 transition-all mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <AlertTriangle size={12} className="text-zinc-500" />
                                    3. Recuperação (Downsell)
                                </label>
                                <button onClick={() => setEnableDownsell(!enableDownsell)} className={`w-10 h-5 rounded-full relative transition-colors ${enableDownsell ? 'bg-[#D49A62]' : 'bg-zinc-800'}`}>
                                    <motion.div animate={{ x: enableDownsell ? 20 : 2 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                                </button>
                            </div>

                            {enableDownsell && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-3 space-y-3 border-t border-white/5 mt-3">
                                    <p className="text-[10px] text-zinc-500 leading-tight mb-3">Se o cliente recusar o Upsell acima, ofereça um item mais barato para não perder a venda.</p>
                                    
                                    <div className="flex bg-[#0A0A0A] border border-white/10 rounded-xl p-1">
                                        <button onClick={() => setDownsellType('SERVICE')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${downsellType === 'SERVICE' ? 'bg-white/10 text-[#F7EFE2]' : 'text-zinc-500'}`}>Serviço</button>
                                        <button onClick={() => setDownsellType('PRODUCT')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${downsellType === 'PRODUCT' ? 'bg-white/10 text-[#F7EFE2]' : 'text-zinc-500'}`}>Produto</button>
                                    </div>

                                    <select value={downsellId} onChange={(e) => setDownsellId(e.target.value)} disabled={isSaving} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-[#F7EFE2] text-xs font-medium outline-none appearance-none">
                                        <option value="" disabled>Item de recuperação...</option>
                                        {downsellType === 'SERVICE' ? services.map((s:any) => <option key={s.id} value={s.id}>{s.name}</option>) : products.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>

                                    <input type="number" placeholder="Desconto Downsell (%)" value={downsellDiscount} onChange={(e) => setDownsellDiscount(e.target.value)} disabled={isSaving} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-[#F7EFE2] text-xs font-medium outline-none" />
                                    <textarea rows={2} placeholder="Copy da última chance" value={downsellCopy} onChange={(e) => setDownsellCopy(e.target.value)} disabled={isSaving} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-[#F7EFE2] text-xs font-medium outline-none resize-none" />
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={handleSave} disabled={isSaving}
                        className="w-full shrink-0 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(184,115,51,0.3)] hover:brightness-110 active:scale-95 transition-all flex justify-center mt-2 relative z-10"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : (initialData ? "Salvar Alterações" : "Ativar Oferta")}
                    </button>
                </motion.div>
            </div>
        </>
    );
}