import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";

interface PaymentSplit {
    id: string;
    methodId: string;
    amount: number;
}

interface CheckoutSheetContentProps {
    appointment: any;
    availableServices: any[];
    availableProducts: any[];
    paymentMethods: any[];
    onConfirm: (
        finalServiceIds: string[],
        finalProductIds: string[],
        payments: { methodId: string; amount: number }[]
    ) => Promise<void>;
    isUpdating: boolean;
}

export function CheckoutSheetContent({
    appointment,
    availableServices = [],
    availableProducts = [],
    paymentMethods = [],
    onConfirm,
    isUpdating
}: CheckoutSheetContentProps) {
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
        appointment?.services?.map((s: any) => s.id) || []
    );
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
        appointment?.products?.map((p: any) => p.id) || []
    );
    const [payments, setPayments] = useState<PaymentSplit[]>(() => {
        if (appointment?.payments && appointment.payments.length > 0) {
            return appointment.payments.map((p: any) => ({
                id: p.id,
                methodId: p.paymentMethodId,
                amount: p.amount
            }));
        }
        return [];
    });

    const isCompleted = appointment?.status === "COMPLETED";

    const totalAmount = useMemo(() => {
        const servicesTotal = selectedServiceIds.reduce((total, id) => {
            const service = availableServices.find((s) => s.id === id);
            return total + (service?.price || 0);
        }, 0);

        const productsTotal = selectedProductIds.reduce((total, id) => {
            const product = availableProducts.find((p) => p.id === id);
            return total + (product?.price || 0);
        }, 0);

        return servicesTotal + productsTotal;
    }, [selectedServiceIds, selectedProductIds, availableServices, availableProducts]);

    useEffect(() => {
        if (!isCompleted && payments.length <= 1 && paymentMethods.length > 0 && totalAmount > 0) {
            setPayments([
                {
                    id: payments[0]?.id || "default",
                    methodId: payments[0]?.methodId || paymentMethods[0].id,
                    amount: totalAmount
                }
            ]);
        }
    }, [totalAmount, paymentMethods, isCompleted]);

    const totalPaid = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const remaining = totalAmount - totalPaid;

    const handleToggleService = (id: string) => {
        setSelectedServiceIds((prev) =>
            prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
        );
    };

    const handleToggleProduct = (id: string) => {
        setSelectedProductIds((prev) =>
            prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
        );
    };

    const updatePaymentAmount = (id: string, amount: number) => {
        setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, amount } : p)));
    };

    const updatePaymentMethod = (id: string, methodId: string) => {
        setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, methodId } : p)));
    };

    const addPaymentSplit = () => {
        if (paymentMethods.length === 0) return;
        setPayments((prev) => [
            ...prev,
            { id: Date.now().toString(), methodId: paymentMethods[0].id, amount: remaining > 0 ? remaining : 0 }
        ]);
    };

    const removePaymentSplit = (id: string) => {
        setPayments((prev) => prev.filter((p) => p.id !== id));
    };

    const isDisabled = isUpdating || Math.abs(remaining) > 0.01 || (selectedServiceIds.length === 0 && selectedProductIds.length === 0);

    return (
        <div className="flex flex-col h-[85vh] bg-[#050505] text-[#F7EFE2]">
            <div className="px-6 py-5 border-b border-white/5 shrink-0">
                <h3 className="text-2xl font-black text-[#F7EFE2]">Finalizar Atendimento</h3>
                <p className="text-[#F7EFE2]/40 text-xs mt-1">Selecione o consumo e informe o pagamento.</p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-48">

                {availableServices.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#F7EFE2]/40 uppercase tracking-wide">Serviços</h4>
                        <div className="flex flex-col gap-2">
                            {availableServices.map((service) => {
                                const isSelected = selectedServiceIds.includes(service.id);
                                return (
                                    <label
                                        key={service.id}
                                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                                            isSelected
                                                ? "border-[#B87333] bg-[#B87333]/5"
                                                : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleToggleService(service.id)}
                                                className="w-5 h-5 accent-[#B87333] rounded bg-white/[0.05] border-white/10 cursor-pointer"
                                            />
                                            <span className={`font-medium ${isSelected ? "text-[#F7EFE2]" : "text-[#F7EFE2]/70"}`}>
                                                {service.name}
                                            </span>
                                        </div>
                                        <span className="font-bold text-[#F7EFE2]">
                                            R$ {service.price.toFixed(2)}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                {availableProducts.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#F7EFE2]/40 uppercase tracking-wide">Produtos</h4>
                        <div className="flex flex-col gap-2">
                            {availableProducts.map((product) => {
                                const isSelected = selectedProductIds.includes(product.id);
                                const isOutOfStock = product.stock <= 0 && !isSelected;
                                return (
                                    <label
                                        key={product.id}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                                            isOutOfStock
                                                ? "opacity-50 cursor-not-allowed border-white/5 bg-white/[0.02]"
                                                : "cursor-pointer"
                                        } ${
                                            isSelected
                                                ? "border-[#B87333] bg-[#B87333]/5"
                                                : !isOutOfStock
                                                ? "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                disabled={isOutOfStock}
                                                onChange={() => !isOutOfStock && handleToggleProduct(product.id)}
                                                className="w-5 h-5 accent-[#B87333] rounded bg-white/[0.05] border-white/10 cursor-pointer disabled:cursor-not-allowed"
                                            />
                                            <div className="flex flex-col">
                                                <span className={`font-medium ${
                                                    isSelected
                                                        ? "text-[#F7EFE2]"
                                                        : isOutOfStock
                                                        ? "text-[#F7EFE2]/30 line-through"
                                                        : "text-[#F7EFE2]/70"
                                                }`}>
                                                    {product.name}
                                                </span>
                                                <span className="text-xs text-[#F7EFE2]/40">Estoque: {product.stock}</span>
                                            </div>
                                        </div>
                                        <span className="font-bold text-[#F7EFE2]">
                                            R$ {product.price.toFixed(2)}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/8 pb-2">
                        <h4 className="text-sm font-bold text-[#F7EFE2]/40 uppercase tracking-wide">Pagamento</h4>
                        <button
                            onClick={addPaymentSplit}
                            className="text-xs font-bold text-[#D49A62] hover:text-[#D49A62]/80 uppercase bg-[#B87333]/10 px-3 py-1.5 rounded-md"
                        >
                            + Adicionar Forma
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {payments.map((payment) => (
                            <div key={payment.id} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="block text-xs text-[#F7EFE2]/40 mb-1 ml-1">Método</label>
                                    <select
                                        value={payment.methodId}
                                        onChange={(e) => updatePaymentMethod(payment.id, e.target.value)}
                                        className="w-full bg-white/[0.05] border border-white/10 text-[#F7EFE2] text-sm rounded-lg px-3 py-3 outline-none focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] transition-all"
                                    >
                                        {paymentMethods.map((pm) => (
                                            <option key={pm.id} value={pm.id}>{pm.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-32">
                                    <label className="block text-xs text-[#F7EFE2]/40 mb-1 ml-1">Valor (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={payment.amount || ""}
                                        onChange={(e) => updatePaymentAmount(payment.id, parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white/[0.05] border border-white/10 text-[#F7EFE2] text-sm rounded-lg px-3 py-3 outline-none focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] transition-all"
                                        placeholder="0.00"
                                    />
                                </div>

                                {payments.length > 1 && (
                                    <div className="pt-5">
                                        <button
                                            onClick={() => removePaymentSplit(payment.id)}
                                            className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition-all"
                                            title="Remover"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-[#050505] border-t border-white/5 p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <span className="text-[#F7EFE2]/50 text-xs uppercase tracking-wide">Total a Pagar</span>
                        <span className="text-2xl font-black text-[#F7EFE2]">R$ {totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[#F7EFE2]/50 text-xs uppercase tracking-wide">Valor Inserido</span>
                        <span className={`text-xl font-bold ${Math.abs(remaining) < 0.01 ? "text-emerald-500" : "text-red-500"}`}>
                            R$ {totalPaid.toFixed(2)}
                        </span>
                    </div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={isDisabled}
                    onClick={() => onConfirm(selectedServiceIds, selectedProductIds, payments)}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 ${
                        isDisabled
                            ? "bg-white/[0.05] text-[#F7EFE2]/25 cursor-not-allowed"
                            : "bg-[#B87333] text-[#050505] hover:bg-[#B87333]/90 shadow-lg shadow-[#B87333]/20"
                    }`}
                >
                    {isUpdating ? "Salvando..." : Math.abs(remaining) > 0.01 ? `Falta R$ ${remaining.toFixed(2)}` : "Confirmar e Dar Baixa"}
                </motion.button>
            </div>
        </div>
    );
}
