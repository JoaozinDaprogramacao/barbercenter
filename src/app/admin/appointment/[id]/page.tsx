"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Componentes da pasta admin/appointment
import { AppointmentHeader } from "@/components/admin/appointment/AppointmentHeader";
import { AppointmentInfoCard } from "@/components/admin/appointment/AppointmentInfoCard";
import { AppointmentActionSheet } from "@/components/admin/appointment/AppointmentActionSheet";

// Componentes de seleção
import { DateSelector } from "@/components/DateSelector";
import { TimeGrid } from "@/components/TimeGrid";
import { Check, AlertTriangle, Calendar, Clock, Scissors } from "lucide-react";

export default function AppointmentDetailPage() {
    const router = useRouter();
    const params = useParams();

    const [activeSheet, setActiveSheet] = useState<"date" | "services" | "cancel" | null>(null);
    const [reminderSent, setReminderSent] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [appointment, setAppointment] = useState<any>(null);
    const [businessHours, setBusinessHours] = useState<any>(null);
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [tempDate, setTempDate] = useState("");
    const [tempTime, setTempTime] = useState("");
    const [tempServiceId, setTempServiceId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/appointments/${params.id}`);
                if (!res.ok) throw new Error("Agendamento não encontrado");
                const data = await res.json();

                setAppointment(data);
                setTempDate(data.dateLabel || data.date);
                setTempTime(data.time);
                setTempServiceId(data.serviceId);

                if (data?.barbershopId) {
                    const shopRes = await fetch(`/api/public/barbershop/${data.barbershopId}`);
                    if (shopRes.ok) {
                        const shopData = await shopRes.json();
                        setBusinessHours(shopData.businessHours);
                        setAvailableServices(shopData.services || []);
                    }
                }
            } catch (e) {
                console.error("❌ Erro no fetchData:", e);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) fetchData();
    }, [params.id]);

    const getAvailableTimesForDate = (selectedDate: string) => {
        if (!businessHours || !selectedDate) return [];
        const monthMap: Record<string, number> = { "jan": 0, "fev": 1, "mar": 2, "abr": 3, "mai": 4, "jun": 5, "jul": 6, "ago": 7, "set": 8, "out": 9, "nov": 10, "dez": 11 };
        const parts = selectedDate.split("-");
        const day = parseInt(parts[0], 10);
        const monthIndex = monthMap[parts[1].toLowerCase()];
        const currentYear = new Date().getFullYear();
        const dayOfWeek = new Date(currentYear, monthIndex, day).getDay();
        const dayConfig = businessHours[dayOfWeek];

        if (!dayConfig || !dayConfig.isOpen) return [];

        const slots = [];
        let [h, m] = dayConfig.openTime.split(":").map(Number);
        const [eh, em] = dayConfig.closeTime.split(":").map(Number);
        let current = h * 60 + m;
        const end = eh * 60 + em;

        while (current < end) {
            slots.push(`${Math.floor(current / 60).toString().padStart(2, "0")}:${(current % 60).toString().padStart(2, "0")}`);
            current += 30;
        }
        return slots;
    };

    const handleUpdateDateTime = async () => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/appointments/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: tempDate, time: tempTime })
            });
            if (res.ok) {
                setAppointment((prev: any) => ({ ...prev, date: tempDate, dateLabel: tempDate, time: tempTime }));
                setActiveSheet(null);
            }
        } catch (error) { alert("Erro ao atualizar."); } finally { setIsUpdating(false); }
    };

    const handleUpdateService = async () => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/appointments/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceId: tempServiceId })
            });
            if (res.ok) {
                const newService = availableServices.find(s => s.id === tempServiceId);
                setAppointment((prev: any) => ({ ...prev, serviceId: tempServiceId, service: newService?.name, price: newService?.price }));
                setActiveSheet(null);
            }
        } catch (error) { alert("Erro ao atualizar serviço."); } finally { setIsUpdating(false); }
    };

    const handleConfirmCancel = async () => {
        try {
            const res = await fetch(`/api/appointments/${params.id}`, { method: 'DELETE' });
            if (res.ok) router.back();
        } catch (error) { console.error(error); }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-orange-600/20 border-t-orange-600 rounded-full animate-spin" />
            <p className="mt-4 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Buscando dados</p>
        </div>
    );

    if (!appointment) return null;

    const formattedData = {
        date: appointment.dateLabel || appointment.date,
        time: appointment.time,
        client: { name: appointment.name || "Cliente", phone: appointment.phone || "" },
        services: appointment.services || [{ id: 1, name: appointment.service }],
        total: appointment.price || 0,
        paymentMethod: appointment.paymentMethod || "Presencial"
    };

    return (
        <main className="min-h-screen w-full bg-black max-w-md mx-auto flex flex-col font-sans relative border-x border-zinc-900 overflow-x-hidden">
            {/* Background Glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-40 left-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full" />
            </div>

            <AppointmentHeader
                onBack={() => router.back()}
                onSendReminder={() => {
                    setReminderSent(true);
                    setTimeout(() => setReminderSent(false), 3000);
                }}
                reminderSent={reminderSent}
            />

            <div className="px-6 pb-24 z-10 space-y-8">
                <motion.header
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <p className="text-orange-600/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Gerenciar</p>
                    <h2 className="text-4xl font-black text-white tracking-tighter leading-none">Agendamento</h2>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <AppointmentInfoCard
                        data={formattedData}
                        onEditDate={() => setActiveSheet("date")}
                        onEditServices={() => setActiveSheet("services")}
                        onWhatsApp={() => {
                            const phone = formattedData.client.phone.replace(/\D/g, '');
                            window.open(`https://wa.me/${phone}`, "_blank");
                        }}
                    />
                </motion.div>

                <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => setActiveSheet("cancel")} 
                    className="w-full py-5 rounded-[2rem] border border-red-500/20 text-red-500/60 font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-red-500/5 active:scale-95"
                >
                    Cancelar Agendamento
                </motion.button>
            </div>

            {/* ACTION SHEETS COM REBRANDING */}
            <AppointmentActionSheet
                isOpen={!!activeSheet}
                onClose={() => !isUpdating && setActiveSheet(null)}
                footer={
                    (activeSheet === "date" || activeSheet === "services") && (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            disabled={isUpdating || (activeSheet === "date" && (!tempDate || !tempTime))}
                            onClick={activeSheet === "date" ? handleUpdateDateTime : handleUpdateService}
                            className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl
                                ${isUpdating ? 'bg-zinc-800 text-zinc-600' : 'bg-orange-600 text-white shadow-orange-600/20'}`}
                        >
                            {isUpdating ? "Salvando..." : "Confirmar Alteração"}
                        </motion.button>
                    )
                }
            >
                {activeSheet === "date" && (
                    <div className="flex flex-col gap-y-8 py-4">
                        <div className="space-y-2">
                            <p className="text-orange-600/60 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                <Calendar size={12} /> Reagendar
                            </p>
                            <h3 className="text-3xl font-black text-white tracking-tighter">Novo Horário</h3>
                        </div>
                        
                        <DateSelector value={tempDate} onChange={(date) => { setTempDate(date); setTempTime(""); }} />
                        
                        {tempDate && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-zinc-800" />
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={12} /> Disponíveis
                                    </span>
                                    <div className="h-px flex-1 bg-zinc-800" />
                                </div>
                                <TimeGrid value={tempTime} availableTimes={getAvailableTimesForDate(tempDate)} onChange={(time) => setTempTime(time)} />
                            </motion.div>
                        )}
                    </div>
                )}

                {activeSheet === "services" && (
                    <div className="space-y-8 py-4">
                        <div className="space-y-2">
                            <p className="text-orange-600/60 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                <Scissors size={12} /> Procedimento
                            </p>
                            <h3 className="text-3xl font-black text-white tracking-tighter">Editar Serviço</h3>
                        </div>

                        <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 no-scrollbar">
                            {availableServices.map((s: any) => {
                                const isSelected = tempServiceId === s.id;
                                return (
                                    <motion.button 
                                        key={s.id} 
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setTempServiceId(s.id)} 
                                        className={`w-full flex justify-between items-center p-6 rounded-[2rem] border-2 transition-all ${isSelected ? "bg-orange-600/10 border-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.1)]" : "bg-zinc-900 border-zinc-800 opacity-60"}`}
                                    >
                                        <div className="text-left">
                                            <span className={`block font-black uppercase text-xs tracking-tight ${isSelected ? "text-orange-500" : "text-white"}`}>{s.name}</span>
                                            <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1 block">R$ {s.price.toFixed(2).replace('.', ',')}</span>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-orange-600 bg-orange-600" : "border-zinc-800"}`}>
                                            {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeSheet === "cancel" && (
                    <div className="space-y-8 text-center py-6">
                        <div className="w-20 h-20 bg-red-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-red-600/20 shadow-2xl">
                            <AlertTriangle size={40} className="text-red-600" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-3xl font-black text-white tracking-tighter leading-tight">Confirmar Cancelamento?</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">Esta ação é irreversível e o cliente será notificado via WhatsApp.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setActiveSheet(null)} className="py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 font-black uppercase tracking-widest text-[10px]">Manter</motion.button>
                            <motion.button whileTap={{ scale: 0.95 }} onClick={handleConfirmCancel} className="py-5 bg-red-600 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-600/20">Cancelar</motion.button>
                        </div>
                    </div>
                )}
            </AppointmentActionSheet>

            {/* Bottom Fade */}
            <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </main>
    );
}