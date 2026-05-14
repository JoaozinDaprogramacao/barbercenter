"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, Loader2, User, Scissors, Package, CalendarClock, ChevronRight, Clock, Check } from "lucide-react";

import { AppointmentActionSheet } from "@/components/admin/appointment/AppointmentActionSheet";
import { TimeGrid } from "@/components/TimeGrid";
import { HorizontalList } from "@/components/admin/agendar/HorizontalList";
import { useAdminAgendar } from "@/hooks/useAdminAgendar";

export default function AdminAgendarPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const barbershopId = session?.user?.barbershopId as string;
    
    const { state, actions } = useAdminAgendar(barbershopId);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);

    const dateOptions = useMemo(() => {
        return Array.from({ length: 14 }, (_, index) => {
            const date = new Date();
            date.setDate(date.getDate() + index);
            
            // Correção de Data: Formato YYYY-MM-DD local sem desvio de fuso
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            
            return {
                value: `${y}-${m}-${d}`,
                weekDay: date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
                day: d,
                month: date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
            };
        });
    }, []);

    const formattedSelectedDate = useMemo(() => {
        if (!state.selectedDate) return "";
        const [year, month, day] = state.selectedDate.split("-");
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
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
            if (res.ok) {
                router.push("/admin/dashboard");
                router.refresh();
            }
        } finally {
            actions.setIsSubmitting(false);
        }
    };

    if (state.isLoadingData) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 size={32} className="text-[#D49A62] animate-spin" /></div>;

    return (
        <main className="min-h-screen w-full bg-[#050505] text-[#F7EFE2] overscroll-behavior-y-none">
            <div className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex items-center gap-4">
                <button onClick={() => router.back()} className="w-11 h-11 shrink-0 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all">
                    <ChevronLeft size={22} />
                </button>
                <div>
                    <h1 className="text-xl font-black">Agendamento Manual</h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#D49A62] mt-1.5 font-bold">Painel de Controle</p>
                </div>
            </div>

            <form className="p-6 space-y-10 pb-[350px]">
                <section className="space-y-4">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">
                        <User size={14} className="text-[#D49A62]" /> Nome do Cliente *
                    </label>
                    <input type="text" value={state.clientName} onChange={(e) => actions.setClientName(e.target.value)} placeholder="Ex: João Silva" className="w-full bg-[#100D0B] border border-white/5 rounded-[1.4rem] px-6 py-5 text-[16px] outline-none focus:border-[#D49A62]/50 transition-all" />
                </section>

                <section className="space-y-4">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">
                        <Scissors size={14} className="text-[#D49A62]" /> Serviços *
                    </label>
                    <HorizontalList items={state.services} type="service" selectedIds={state.selectedServices} onToggle={(id) => actions.setSelectedServices(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} />
                </section>

                {state.products.length > 0 && (
                    <section className="space-y-4">
                        <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">
                            <Package size={14} className="text-[#D49A62]" /> Produtos Vendidos
                        </label>
                        <HorizontalList items={state.products} type="product" selectedIds={state.selectedProducts} onToggle={(id) => actions.setSelectedProducts(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} />
                    </section>
                )}

                <section className="space-y-4">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">
                        <User size={14} className="text-[#D49A62]" /> Profissional
                    </label>
                    <select value={state.selectedBarber} onChange={(e) => { actions.setSelectedBarber(e.target.value); actions.setSelectedTime(""); }} className="w-full bg-[#100D0B] border border-white/5 rounded-[1.4rem] px-6 py-5 text-[16px] appearance-none">
                        {state.team.map((member: any) => <option key={member.id} value={member.id}>{member.name}</option>)}
                    </select>
                </section>

                <section className="space-y-4">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">
                        <CalendarClock size={14} className="text-[#D49A62]" /> Data e Horário *
                    </label>
                    <button type="button" onClick={() => setIsDateModalOpen(true)} className="w-full bg-[#100D0B] border border-white/5 rounded-[1.4rem] px-6 py-5 flex items-center justify-between">
                        <span className={`text-[16px] font-medium ${state.selectedDate && state.selectedTime ? "text-[#F7EFE2]" : "text-zinc-600"}`}>
                            {state.selectedDate && state.selectedTime ? `${formattedSelectedDate} às ${state.selectedTime}` : "Toque para selecionar..."}
                        </span>
                        <ChevronRight size={22} className="text-zinc-500" />
                    </button>
                </section>
            </form>

            <AppointmentActionSheet isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)} footer={<button type="button" onClick={() => setIsDateModalOpen(false)} disabled={!state.selectedDate || !state.selectedTime} className="w-full py-5 bg-[#D49A62] text-black rounded-[1.4rem] font-black uppercase text-[14px]">Confirmar Horário</button>}>
                <div className="flex flex-col gap-y-8 py-4 px-6">
                    <div className="space-y-2"><h3 className="text-3xl font-black text-white tracking-tighter">Data e Horário</h3><p className="text-zinc-500 text-sm">Selecione o momento do agendamento.</p></div>
                    <div className="-mx-6 overflow-x-auto px-6 pb-2">
                        <div className="flex gap-3 min-w-max">
                            {dateOptions.map((date) => (
                                <button key={date.value} type="button" onClick={() => { actions.setSelectedDate(date.value); actions.setSelectedTime(""); }} className={`min-w-[76px] h-[96px] rounded-[1.4rem] border flex flex-col items-center justify-center transition-all ${state.selectedDate === date.value ? "bg-[#D49A62] text-black" : "bg-[#100D0B] border-white/10 text-zinc-400"}`}>
                                    <span className="text-[11px] uppercase font-black">{date.weekDay}</span>
                                    <span className="text-3xl font-black mt-2">{date.day}</span>
                                    <span className="text-[11px] uppercase font-bold mt-2">{date.month}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    {state.selectedDate && (
                        <div className="space-y-6 pb-4">
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-zinc-800" />
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> Horários</span>
                                <div className="h-px flex-1 bg-zinc-800" />
                            </div>
                            <TimeGrid value={state.selectedTime} availableTimes={state.availableTimes} onChange={actions.setSelectedTime} />
                        </div>
                    )}
                </div>
            </AppointmentActionSheet>

            <div className="fixed bottom-0 left-0 right-0 bg-[#050505]/95 backdrop-blur-2xl border-t border-white/10 p-6 z-50 pb-8">
                <div className="max-w-xl mx-auto">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <div className="flex flex-col"><span className="text-zinc-500 font-bold text-[10px] uppercase">Total a cobrar</span><span className="text-2xl font-black text-[#D49A62]">R$ {state.totalPrice.toFixed(2).replace(".", ",")}</span></div>
                        <div className="text-right"><span className="text-zinc-500 font-bold text-[10px] uppercase block">Duração</span><span className="text-zinc-300 font-bold">{state.totalDuration} min</span></div>
                    </div>
                    <button type="button" onClick={handleSubmit} disabled={state.isSubmitting || !state.clientName || state.selectedServices.length === 0 || !state.selectedDate || !state.selectedTime} className="w-full py-5 bg-gradient-to-br from-[#D49A62] via-[#B87333] to-[#8B5A2B] text-[#050505] rounded-[1.5rem] font-black uppercase text-sm shadow-lg shadow-[#D49A62]/10 active:scale-[0.97] transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                        {state.isSubmitting ? <Loader2 size={22} className="animate-spin" /> : <><Check size={20} strokeWidth={3} /> Finalizar Agendamento</>}
                    </button>
                </div>
            </div>
        </main>
    );
}