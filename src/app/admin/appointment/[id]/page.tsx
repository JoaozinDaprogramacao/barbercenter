"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";

import { AppointmentHeader } from "@/components/admin/appointment/AppointmentHeader";
import { AppointmentInfoCard } from "@/components/admin/appointment/AppointmentInfoCard";
import { AppointmentActionSheet } from "@/components/admin/appointment/AppointmentActionSheet";

import { LoadingScreen } from "@/components/appointment/id/LoadingScreen";
import { DateSheetContent } from "@/components/appointment/id/DateSheetContent";
import { ServicesSheetContent } from "@/components/appointment/id/ServicesSheetContent";
import { CancelSheetContent } from "@/components/appointment/id/CancelSheetContent";
import { CheckoutSheetContent } from "@/components/appointment/id/CheckoutSheetContent";

import { useAppointmentManager } from "@/hooks/useAppointmentManager";

type SheetType = "date" | "services" | "cancel" | "checkout" | null;

export default function AppointmentDetailPage() {
    const router = useRouter();
    const params = useParams();
    const appointmentId = params.id as string;

    const [activeSheet, setActiveSheet] = useState<SheetType>(null);
    const [reminderSent, setReminderSent] = useState(false);

    const [tempDate, setTempDate] = useState("");
    const [tempTime, setTempTime] = useState("");
    const [tempServiceIds, setTempServiceIds] = useState<string[]>([]);

    const {
        appointment, isLoading, isUpdating, availableServices,
        availableProducts, 
        paymentMethods,
        getAvailableTimes, updateDateTime, updateServices, cancelAppointment,
        checkoutAppointment
    } = useAppointmentManager(appointmentId);

    useEffect(() => {
        if (activeSheet === "date" && appointment) {
            setTempDate(appointment.dateLabel || appointment.date);
            setTempTime(appointment.time);
        }
        if (activeSheet === "services" && appointment) {
            setTempServiceIds(appointment.services?.map((s: any) => s.id) || []);
        }
    }, [activeSheet, appointment]);

    const handleConfirm = async () => {
        let success = false;
        if (activeSheet === "date") {
            success = await updateDateTime(tempDate, tempTime);
        } else if (activeSheet === "services") {
            success = await updateServices(tempServiceIds);
        }
        if (success) setActiveSheet(null);
    };

    if (isLoading) return <LoadingScreen />;
    if (!appointment) return null;

    const formattedData = {
        date: appointment.dateLabel || appointment.date,
        time: appointment.time,
        client: { name: appointment.name || "Cliente", phone: appointment.phone || "" },
        services: [...(appointment.services || []), ...(appointment.products || [])],
        total: appointment.price || 0,
        paymentMethod: appointment.paymentMethod || "Presencial"
    };

    // 👇 Verifica se a baixa já foi dada
    const isCompleted = appointment.status === "COMPLETED";

    return (
        <main className="min-h-screen w-full bg-black max-w-md mx-auto flex flex-col font-sans relative border-x border-zinc-900 overflow-x-hidden">
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
                <motion.header initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <p className="text-orange-600/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Gerenciar</p>
                    <h2 className="text-4xl font-black text-white tracking-tighter leading-none">Agendamento</h2>
                </motion.header>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <AppointmentInfoCard
                        data={formattedData}
                        onEditDate={() => setActiveSheet("date")}
                        onEditServices={() => setActiveSheet("services")}
                        onWhatsApp={() => window.open(`https://wa.me/${formattedData.client.phone.replace(/\D/g, '')}`, "_blank")}
                    />
                </motion.div>

                {/* 👇 Botão dinâmico: Muda de cor e texto se já estiver finalizado */}
                <motion.button
                    onClick={() => setActiveSheet("checkout")}
                    className={`w-full py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] text-[12px] shadow-lg transition-all hover:scale-[0.98] active:scale-95 ${
                        isCompleted 
                        ? "bg-blue-600 shadow-blue-600/20" // Azul para edição
                        : "bg-green-500 shadow-green-500/20" // Verde para primeira baixa
                    }`}
                >
                    {isCompleted ? "Editar Baixa" : "Dar Baixa / Finalizar"}
                </motion.button>

                {/* 👇 Esconde o botão de cancelar se a baixa já foi dada */}
                {!isCompleted && (
                    <motion.button
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        onClick={() => setActiveSheet("cancel")}
                        className="w-full py-5 rounded-[2rem] border border-red-500/20 text-red-500/60 font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-red-500/5 active:scale-95"
                    >
                        Cancelar Agendamento
                    </motion.button>
                )}
            </div>

            <AppointmentActionSheet
                isOpen={!!activeSheet}
                onClose={() => !isUpdating && setActiveSheet(null)}
                footer={
                    (activeSheet === "date" || activeSheet === "services") && (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            disabled={isUpdating || (activeSheet === "date" && (!tempDate || !tempTime)) || (activeSheet === "services" && tempServiceIds.length === 0)}
                            onClick={handleConfirm}
                            className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl
                                ${isUpdating || (activeSheet === "services" && tempServiceIds.length === 0) ? 'bg-zinc-800 text-zinc-600' : 'bg-orange-600 text-white shadow-orange-600/20'}`}
                        >
                            {isUpdating ? "Salvando..." : "Confirmar Alteração"}
                        </motion.button>
                    )
                }
            >
                {activeSheet === "date" && (
                    <DateSheetContent
                        date={tempDate}
                        time={tempTime}
                        setDate={setTempDate}
                        setTime={setTempTime}
                        getTimes={getAvailableTimes}
                    />
                )}

                {activeSheet === "services" && (
                    <ServicesSheetContent
                        selectedIds={tempServiceIds}
                        setSelectedIds={setTempServiceIds}
                        services={availableServices}
                    />
                )}

                {activeSheet === "cancel" && (
                    <CancelSheetContent
                        onKeep={() => setActiveSheet(null)}
                        onConfirm={async () => {
                            const ok = await cancelAppointment();
                            if (ok) router.back();
                        }}
                    />
                )}
                {activeSheet === "checkout" && (
                    <CheckoutSheetContent
                        appointment={appointment}
                        availableServices={availableServices}
                        availableProducts={availableProducts || []}
                        paymentMethods={paymentMethods || []}
                        isUpdating={isUpdating}
                        onConfirm={async (finalServiceIds, finalProductIds, payments) => { 
                            const ok = await checkoutAppointment(finalServiceIds, finalProductIds, payments);
                            if (ok) {
                                setActiveSheet(null);
                                router.back();
                            }
                        }}
                    />
                )}
            </AppointmentActionSheet>

            <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </main>
    );
}