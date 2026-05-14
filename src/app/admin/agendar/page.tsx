"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, Loader2, User, Scissors, Package, CalendarClock, ChevronRight, Clock, Check } from "lucide-react";
import { AppointmentActionSheet } from "@/components/admin/appointment/AppointmentActionSheet";
import { TimeGrid } from "@/components/TimeGrid";
import { useAdminAgendar } from "@/hooks/useAdminAgendar"; // O hook que criamos acima
import { HorizontalList } from "@/components/admin/agendar/HorizontalList";

export default function AdminAgendarPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const barbershopId = session?.user?.barbershopId as string;
    const { state, actions } = useAdminAgendar(barbershopId);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);

    // Cálculos de Data para o Modal
    const dateOptions = useMemo(() => {
        return Array.from({ length: 14 }, (_, i) => {
            const d = new Date(); d.setDate(d.getDate() + i);
            return {
                value: d.toISOString().split('T')[0],
                weekDay: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
                day: d.toLocaleDateString("pt-BR", { day: "2-digit" }),
                month: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
            };
        });
    }, []);

    const formattedDateLabel = useMemo(() => {
        if (!state.selectedDate) return "";
        return new Date(state.selectedDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
    }, [state.selectedDate]);

    const handleSubmit = async () => {
        actions.setIsSubmitting(true);
        try {
            const res = await fetch("/api/public/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientName: state.clientName,
                    serviceIds: state.selectedServices,
                    productIds: state.selectedProducts,
                    date: state.selectedDate,
                    time: state.selectedTime,
                    barbershopId,
                    barberId: state.selectedBarber,
                    totalPrice: state.totalPrice,
                }),
            });
            if (res.ok) { router.push("/admin/dashboard"); router.refresh(); }
            else { alert("Erro ao agendar."); }
        } finally { actions.setIsSubmitting(false); }
    };

    if (state.isLoadingData) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="text-[#D49A62] animate-spin" /></div>;

    return (
        <main className="min-h-screen w-full bg-[#050505] text-[#F7EFE2] pb-40">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex items-center gap-4">
                <button onClick={() => router.back()} className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all">
                    <ChevronLeft size={22} />
                </button>
                <div>
                    <h1 className="text-xl font-black">Agendamento Manual</h1>
                    <p className="text-[10px] uppercase text-[#D49A62] font-bold">Painel de Controle</p>
                </div>
            </div>

            <div className="p-6 space-y-10">
                {/* Cliente */}
                <section className="space-y-4">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase text-zinc-500"><User size={14} className="text-[#D49A62]" /> Nome do Cliente *</label>
                    <input type="text" value={state.clientName} onChange={(e) => actions.setClientName(e.target.value)} placeholder="Ex: João Silva" className="w-full bg-[#100D0B] border border-white/5 rounded-[1.4rem] px-6 py-5 text-[16px] outline-none focus:border-[#D49A62]/50 transition-all" />
                </section>

                {/* Serviços */}
                <section className="space-y-4">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase text-zinc-500"><Scissors size={14} className="text-[#D49A62]" /> Serviços *</label>
                    <HorizontalList 
                        items={state.services} 
                        selectedIds={state.selectedServices} 
                        onToggle={(id: string) => actions.setSelectedServices((prev: string[]) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
                    />
                </section>

                {/* Produtos */}
                {state.products.length > 0 && (
                    <section className="space-y-4">
                        <label className="flex items-center gap-2 text-[11px] font-black uppercase text-zinc-500"><Package size={14} className="text-[#D49A62]" /> Produtos Vendidos</label>
                        <HorizontalList 
                            items={state.products} 
                            selectedIds={state.selectedProducts} 
                            onToggle={(id: string) => actions.setSelectedProducts((prev: string[]) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
                        />
                    </section>
                )}

                {/* Profissional */}
                <section className="space-y-4">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase text-zinc-500"><User size={14} className="text-[#D49A62]" /> Profissional</label>
                    <select value={state.selectedBarber} onChange={(e) => actions.setSelectedBarber(e.target.value)} className="w-full bg-[#100D0B] border border-white/5 rounded-[1.4rem] px-6 py-5 text-[16px] appearance-none">
                        {state.team.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                </section>

                {/* Data Trigger */}
                <section className="space-y-4">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase text-zinc-500"><CalendarClock size={14} className="text-[#D49A62]" /> Data e Horário *</label>
                    <button onClick={() => setIsDateModalOpen(true)} className="w-full bg-[#100D0B] border border-white/5 rounded-[1.4rem] px-6 py-5 flex items-center justify-between">
                        <span className={state.selectedDate ? "text-white" : "text-zinc-600"}>{state.selectedDate && state.selectedTime ? `${formattedDateLabel} às ${state.selectedTime}` : "Selecionar data..."}</span>
                        <ChevronRight size={20} className="text-zinc-500" />
                    </button>
                </section>
            </div>

            {/* Modal de Data */}
            <AppointmentActionSheet isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)} footer={<button onClick={() => setIsDateModalOpen(false)} className="w-full py-5 bg-[#D49A62] text-black rounded-[1.4rem] font-black uppercase">Confirmar</button>}>
                <div className="p-6 space-y-8">
                    <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6">
                        {dateOptions.map((d) => (
                            <button key={d.value} onClick={() => actions.setSelectedDate(d.value)} className={`min-w-[70px] h-20 rounded-2xl border flex flex-col items-center justify-center ${state.selectedDate === d.value ? "bg-[#D49A62] text-black" : "bg-[#100D0B] border-white/10 text-zinc-500"}`}>
                                <span className="text-[10px] uppercase font-bold">{d.weekDay}</span>
                                <span className="text-xl font-black">{d.day}</span>
                            </button>
                        ))}
                    </div>
                    {state.selectedDate && <TimeGrid value={state.selectedTime} availableTimes={state.availableTimes} onChange={actions.setSelectedTime} />}
                </div>
            </AppointmentActionSheet>

            {/* Footer Fixo */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#050505]/95 backdrop-blur-2xl border-t border-white/10 p-6 z-50">
                <div className="max-w-xl mx-auto flex items-center justify-between mb-4">
                    <div><span className="text-zinc-500 text-[10px] uppercase block font-bold">Total</span><span className="text-2xl font-black text-[#D49A62]">R$ {state.totalPrice.toFixed(2).replace(".", ",")}</span></div>
                    <div className="text-right"><span className="text-zinc-500 text-[10px] uppercase block font-bold">Duração</span><span className="text-white font-bold">{state.totalDuration} min</span></div>
                </div>
                <button onClick={handleSubmit} disabled={state.isSubmitting || !state.clientName || state.selectedServices.length === 0 || !state.selectedDate || !state.selectedTime} className="w-full py-5 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-black rounded-3xl font-black uppercase tracking-widest shadow-lg shadow-[#D49A62]/10 disabled:opacity-30">
                    {state.isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Confirmar Agendamento"}
                </button>
            </div>
        </main>
    );
}