"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

// Componentes da pasta admin/appointment
import { AppointmentHeader } from "@/components/admin/appointment/AppointmentHeader";
import { AppointmentInfoCard } from "@/components/admin/appointment/AppointmentInfoCard";
import { AppointmentActionSheet } from "@/components/admin/appointment/AppointmentActionSheet";

// Componentes de seleção (os mesmos usados no Chat)
import { DateSelector } from "@/components/DateSelector";
import { TimeGrid } from "@/components/TimeGrid";

export default function AppointmentDetailPage() {
    const router = useRouter();
    const params = useParams();

    // Estados de controle da UI
    const [activeSheet, setActiveSheet] = useState<"date" | "services" | "cancel" | null>(null);
    const [reminderSent, setReminderSent] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Estados para dados reais da API
    const [appointment, setAppointment] = useState<any>(null);
    const [businessHours, setBusinessHours] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Estados temporários para edição de Data e Hora
    const [tempDate, setTempDate] = useState("");
    const [tempTime, setTempTime] = useState("");

    // 1. Busca os detalhes do agendamento e os horários da barbearia
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Busca primeiro o agendamento
                const res = await fetch(`/api/appointments/${params.id}`);
                if (!res.ok) throw new Error("Agendamento não encontrado");
                const data = await res.json();

                // Define o agendamento no estado
                setAppointment(data);
                setTempDate(data.dateLabel || data.date);
                setTempTime(data.time);

                // 2. SÓ BUSCA A BARBEARIA SE O ID EXISTIR
                if (data?.barbershopId) {
                    const shopRes = await fetch(`/api/public/barbershop/${data.barbershopId}`);
                    if (shopRes.ok) {
                        const shopData = await shopRes.json();
                        setBusinessHours(shopData.businessHours);
                        console.log("✅ BusinessHours carregado com sucesso!");
                    } else {
                        console.error("❌ Erro ao buscar dados da barbearia");
                    }
                } else {
                    console.error("❌ O agendamento veio sem barbershopId");
                }

            } catch (e) {
                console.error("❌ Erro no fetchData:", e);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchData();
        }
    }, [params.id]);

    // 2. Lógica de Geração e Filtro de Horários (A mesma do Chat)
    const generateSlots = (start: string, end: string) => {
        const slots = [];
        let [startHour, startMinute] = start.split(":").map(Number);
        const [endHour, endMinute] = end.split(":").map(Number);
        const currentTime = new Date();
        currentTime.setHours(startHour, startMinute, 0, 0);
        const endTime = new Date();
        endTime.setHours(endHour, endMinute, 0, 0);

        while (currentTime < endTime) {
            const hour = currentTime.getHours().toString().padStart(2, "0");
            const minute = currentTime.getMinutes().toString().padStart(2, "0");
            slots.push(`${hour}:${minute}`);
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
        return slots;
    };

    const getAvailableTimesForDate = (selectedDate: string) => {
        // MONITOR 1: O objeto de horários existe?
        console.log("🛠️ DEBUG [1] - BusinessHours disponível?", !!businessHours);
        if (!businessHours || !selectedDate) return [];

        const monthMap: Record<string, number> = {
            "jan": 0, "fev": 1, "mar": 2, "abr": 3, "mai": 4, "jun": 5,
            "jul": 6, "ago": 7, "set": 8, "out": 9, "nov": 10, "dez": 11
        };

        const parts = selectedDate.split("-");
        const day = parseInt(parts[0], 10);
        const monthStr = parts[1].toLowerCase();
        const monthIndex = monthMap[monthStr];
        const currentYear = new Date().getFullYear();

        const selectedDateObj = new Date(currentYear, monthIndex, day);
        const dayOfWeek = selectedDateObj.getDay();

        // MONITOR 2: Qual dia da semana o sistema detectou?
        console.log(`🛠️ DEBUG [2] - Dia da semana detectado para ${selectedDate}:`, dayOfWeek, "(0=Dom, 5=Sex, 6=Sáb)");

        const dayConfig = businessHours[dayOfWeek];

        // MONITOR 3: A configuração desse dia no banco está aberta?
        console.log("🛠️ DEBUG [3] - Configuração do banco para esse dia:", dayConfig);

        if (!dayConfig || !dayConfig.isOpen || !dayConfig.openTime || !dayConfig.closeTime) {
            console.warn("⚠️ AVISO: Barbearia fechada ou sem horas no banco para este dia.");
            return [];
        }

        let slots = generateSlots(dayConfig.openTime, dayConfig.closeTime);

        // MONITOR 4: Filtro de horários passados (caso seja hoje)
        const now = new Date();
        const todayCompare = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const selectedCompare = new Date(currentYear, monthIndex, day).getTime();

        if (todayCompare === selectedCompare) {
            const nowTimeInMinutes = now.getHours() * 60 + now.getMinutes();
            console.log("🛠️ DEBUG [4] - É HOJE. Minutos atuais:", nowTimeInMinutes);

            slots = slots.filter(slot => {
                const [h, m] = slot.split(':').map(Number);
                const slotMinutes = h * 60 + m;
                return slotMinutes > nowTimeInMinutes + 30;
            });
        }

        console.log("🛠️ DEBUG [5] - Slots finais gerados:", slots);
        return slots;
    };

    // 3. Ação de Salvar Data/Hora
    const handleUpdateDateTime = async () => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/appointments/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: tempDate, time: tempTime })
            });

            if (res.ok) {
                // Atualiza o estado local para refletir na tela imediatamente
                setAppointment((prev: any) => ({ ...prev, date: tempDate, dateLabel: tempDate, time: tempTime }));
                setActiveSheet(null);
            }
        } catch (error) {
            alert("Erro ao atualizar.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleConfirmCancel = async () => {
        try {
            const res = await fetch(`/api/appointments/${params.id}`, { method: 'DELETE' });
            if (res.ok) router.back();
        } catch (error) { console.error(error); }
    };

    const closeSheet = () => !isUpdating && setActiveSheet(null);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (!appointment) return null;

    const formattedData = {
        date: appointment.dateLabel || appointment.date,
        time: appointment.time,
        client: {
            name: appointment.name || "Cliente",
            phone: appointment.phone || ""
        },
        services: appointment.services || [{ id: 1, name: appointment.service }],
        total: appointment.price || 0,
        paymentMethod: appointment.paymentMethod || "Presencial"
    };

    return (
        <main className="min-h-screen w-full bg-background max-w-md mx-auto flex flex-col font-sans relative">

            <AppointmentHeader
                onBack={() => router.back()}
                onSendReminder={() => {
                    setReminderSent(true);
                    setTimeout(() => setReminderSent(false), 3000);
                }}
                reminderSent={reminderSent}
            />

            <div className="px-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <header>
                    <p className="text-white/40 text-sm font-medium mb-1">Gerenciar</p>
                    <h2 className="text-4xl font-black text-white tracking-tight leading-none">Agendamento</h2>
                </header>

                <AppointmentInfoCard
                    data={formattedData}
                    onEditDate={() => setActiveSheet("date")}
                    onEditServices={() => setActiveSheet("services")}
                    onWhatsApp={() => {
                        const phone = formattedData.client.phone.replace(/\D/g, '');
                        window.open(`https://wa.me/${phone}`, "_blank");
                    }}
                />

                <button
                    onClick={() => setActiveSheet("cancel")}
                    className="w-full py-5 rounded-[24px] border border-red-500/20 text-red-500/40 font-black uppercase tracking-[0.2em] text-[10px] active:bg-red-500 active:text-white transition-all hover:border-red-500/40"
                >
                    Cancelar Agendamento
                </button>
            </div>
            <AppointmentActionSheet
                isOpen={!!activeSheet}
                onClose={closeSheet}
                footer={
                    activeSheet === "date" && (
                        <button
                            disabled={!tempDate || !tempTime || isUpdating}
                            onClick={handleUpdateDateTime}
                            className={`w-full py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] transition-all
                    ${(!tempDate || !tempTime || isUpdating)
                                    ? 'bg-white/5 text-white/10 border border-white/5'
                                    : 'bg-accent text-black active:scale-95 shadow-lg shadow-accent/10'}`}
                        >
                            {isUpdating ? "Salvando..." : "Confirmar Alteração"}
                        </button>
                    )
                }
            >
                {activeSheet === "date" && (
                    <div className="flex flex-col gap-y-6">
                        {/* Título Fixo dentro do scroll-container para contexto */}
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white tracking-tight leading-none">
                                Alterar Horário
                            </h3>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                Selecione data e hora
                            </p>
                        </div>

                        {/* Seleção de Data */}
                        <DateSelector
                            value={tempDate}
                            onChange={(date) => {
                                setTempDate(date);
                                setTempTime("");
                            }}
                        />

                        {/* Seleção de Horário */}
                        {tempDate && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex items-center gap-3">
                                    <div className="h-[1px] flex-1 bg-white/5" />
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                                        Disponíveis
                                    </span>
                                    <div className="h-[1px] flex-1 bg-white/5" />
                                </div>

                                <TimeGrid
                                    value={tempTime}
                                    availableTimes={getAvailableTimesForDate(tempDate)}
                                    onChange={(time) => setTempTime(time)}
                                />
                            </div>
                        )}
                    </div>
                )}

                {activeSheet === "services" && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white tracking-tight">Editar Serviços</h3>
                        <div className="space-y-3">
                            {["Corte", "Barba", "Sobrancelha"].map(s => (
                                <div key={s} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-white font-bold">{s}</span>
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 rounded-lg accent-accent bg-transparent border-white/10"
                                        defaultChecked={formattedData.services.some((ser: any) => ser.name === s)}
                                    />
                                </div>
                            ))}
                        </div>
                        <button onClick={closeSheet} className="w-full py-4 bg-accent rounded-2xl font-black text-black uppercase tracking-widest active:scale-95 transition-all text-[10px]">
                            ATUALIZAR SERVIÇOS
                        </button>
                    </div>
                )}

                {activeSheet === "cancel" && (
                    <div className="space-y-6 text-center py-4">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-2xl">⚠️</div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white leading-tight">Deseja realmente cancelar?</h3>
                            <p className="text-white/40 text-sm">O cliente receberá uma notificação automática.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={closeSheet} className="py-4 bg-white/5 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">
                                MANTER
                            </button>
                            <button onClick={handleConfirmCancel} className="py-4 bg-red-500 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">
                                CONFIRMAR
                            </button>
                        </div>
                    </div>
                )}
            </AppointmentActionSheet>
        </main>
    );
}