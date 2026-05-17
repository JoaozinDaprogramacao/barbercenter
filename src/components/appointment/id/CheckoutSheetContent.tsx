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
        // Se a baixa AINDA NÃO FOI DADA, nós atualizamos o valor automaticamente 
        // quando o barbeiro seleciona mais serviços.
        if (!isCompleted && payments.length <= 1 && paymentMethods.length > 0 && totalAmount > 0) {
            setPayments([
                {
                    id: payments[0]?.id || "default",
                    methodId: payments[0]?.methodId || paymentMethods[0].id,
                    amount: totalAmount
                }
            ]);
        }
        // Se a baixa JÁ FOI DADA (isCompleted), nós NÃO alteramos os pagamentos 
        // automaticamente para preservar o histórico real que veio do banco.
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

    return (
        <div className="flex flex-col h-[85vh] bg-black text-white">
            <div className="px-6 py-5 border-b border-zinc-900 shrink-0">
                <h3 className="text-2xl font-black">Finalizar Atendimento</h3>
                <p className="text-zinc-500 text-xs mt-1">Selecione o consumo e informe o pagamento.</p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-48">

                {availableServices.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wide">Serviços</h4>
                        <div className="flex flex-col gap-2">
                            {availableServices.map((service) => {
                                const isSelected = selectedServiceIds.includes(service.id);
                                return (
                                    <label
                                        key={service.id}
                                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${isSelected ? "border-orange-600 bg-orange-600/5" : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleToggleService(service.id)}
                                                className="w-5 h-5 accent-orange-600 rounded bg-zinc-900 border-zinc-700 cursor-pointer"
                                            />
                                            <span className={`font-medium ${isSelected ? "text-white" : "text-zinc-300"}`}>
                                                {service.name}
                                            </span>
                                        </div>
                                        <span className="font-bold text-white">
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
                        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wide">Produtos</h4>
                        <div className="flex flex-col gap-2">
                            {availableProducts.map((product) => {
                                const isSelected = selectedProductIds.includes(product.id);
                                const isOutOfStock = product.stock <= 0 && !isSelected;
                                return (
                                    <label
                                        key={product.id}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${isOutOfStock ? "opacity-50 cursor-not-allowed border-zinc-900 bg-zinc-950" : "cursor-pointer"
                                            } ${isSelected ? "border-orange-600 bg-orange-600/5" : !isOutOfStock ? "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900" : ""
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                disabled={isOutOfStock}
                                                onChange={() => !isOutOfStock && handleToggleProduct(product.id)}
                                                className="w-5 h-5 accent-orange-600 rounded bg-zinc-900 border-zinc-700 cursor-pointer disabled:cursor-not-allowed"
                                            />
                                            <div className="flex flex-col">
                                                <span className={`font-medium ${isSelected ? "text-white" : isOutOfStock ? "text-zinc-600 line-through" : "text-zinc-300"}`}>
                                                    {product.name}
                                                </span>
                                                <span className="text-xs text-zinc-500">Estoque: {product.stock}</span>
                                            </div>
                                        </div>
                                        <span className="font-bold text-white">
                                            R$ {product.price.toFixed(2)}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wide">Pagamento</h4>
                        <button
                            onClick={addPaymentSplit}
                            className="text-xs font-bold text-orange-500 hover:text-orange-400 uppercase bg-orange-500/10 px-3 py-1.5 rounded-md"
                        >
                            + Adicionar Forma
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {payments.map((payment) => (
                            <div key={payment.id} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="block text-xs text-zinc-500 mb-1 ml-1">Método</label>
                                    <select
                                        value={payment.methodId}
                                        onChange={(e) => updatePaymentMethod(payment.id, e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                    >
                                        {paymentMethods.map((pm) => (
                                            <option key={pm.id} value={pm.id}>{pm.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-32">
                                    <label className="block text-xs text-zinc-500 mb-1 ml-1">Valor (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={payment.amount || ""}
                                        onChange={(e) => updatePaymentAmount(payment.id, parseFloat(e.target.value) || 0)}
                                        className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
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

            <div className="absolute bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <span className="text-zinc-400 text-xs uppercase tracking-wide">Total a Pagar</span>
                        <span className="text-2xl font-black text-white">R$ {totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-zinc-400 text-xs uppercase tracking-wide">Valor Inserido</span>
                        <span className={`text-xl font-bold ${Math.abs(remaining) < 0.01 ? "text-green-500" : "text-red-500"}`}>
                            R$ {totalPaid.toFixed(2)}
                        </span>
                    </div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={isUpdating || Math.abs(remaining) > 0.01 || (selectedServiceIds.length === 0 && selectedProductIds.length === 0)}
                    onClick={() => onConfirm(selectedServiceIds, selectedProductIds, payments)}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2
            ${isUpdating || Math.abs(remaining) > 0.01 || (selectedServiceIds.length === 0 && selectedProductIds.length === 0)
                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                            : "bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-600/20"}`}
                >
                    {isUpdating ? "Salvando..." : Math.abs(remaining) > 0.01 ? `Falta R$ ${remaining.toFixed(2)}` : "Confirmar e Dar Baixa"}
                </motion.button>
            </div>
        </div>
    );
}