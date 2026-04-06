"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

// Imports atualizados para a pasta @/components/admin/appointment/
import { AppointmentHeader } from "@/components/admin/appointment/AppointmentHeader";
import { AppointmentInfoCard } from "@/components/admin/appointment/AppointmentInfoCard";
import { AppointmentActionSheet } from "@/components/admin/appointment/AppointmentActionSheet";

export default function AppointmentDetailPage() {
    const router = useRouter();
    const params = useParams();

    const [activeSheet, setActiveSheet] = useState<"date" | "services" | "cancel" | null>(null);
    const [reminderSent, setReminderSent] = useState(false);

    // Mock dos dados (Pode ser substituído por um fetch usando params.id)
    const [data] = useState({
        date: "Qua, 17 de abr de 2024",
        time: "09:00 às 09:40",
        client: {
            name: "Lucas Paim",
            phone: "5541996664344"
        },
        services: [
            { id: 1, name: "Corte" },
            { id: 2, name: "Barba" }
        ],
        total: 50.00,
        paymentMethod: "Cartão de crédito"
    });

    const closeSheet = () => setActiveSheet(null);

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
                    data={data}
                    onEditDate={() => setActiveSheet("date")}
                    onEditServices={() => setActiveSheet("services")}
                    onWhatsApp={() => window.open(`https://wa.me/${data.client.phone}`, "_blank")}
                />

                <button
                    onClick={() => setActiveSheet("cancel")}
                    className="w-full py-5 rounded-[24px] border border-red-500/20 text-red-500/40 font-black uppercase tracking-[0.2em] text-[10px] active:bg-red-500 active:text-white transition-all hover:border-red-500/40"
                >
                    Cancelar Agendamento
                </button>
            </div>

            {/* Gerenciamento dos Bottom Sheets */}
            <AppointmentActionSheet isOpen={!!activeSheet} onClose={closeSheet}>
                {activeSheet === "date" && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white">Alterar Horário</h3>
                        <div className="p-10 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center text-white/40 font-bold uppercase tracking-widest">
                            Calendário Picker
                        </div>
                        <button onClick={closeSheet} className="w-full py-4 bg-accent rounded-2xl font-black text-black uppercase tracking-widest active:scale-95 transition-all">
                            SALVAR NOVO HORÁRIO
                        </button>
                    </div>
                )}

                {activeSheet === "services" && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white">Editar Serviços</h3>
                        <div className="space-y-3">
                            {["Corte", "Barba", "Sobrancelha"].map(s => (
                                <div key={s} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-white font-bold">{s}</span>
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 rounded-lg accent-accent bg-transparent border-white/10"
                                        defaultChecked={data.services.some(service => service.name === s)}
                                    />
                                </div>
                            ))}
                        </div>
                        <button onClick={closeSheet} className="w-full py-4 bg-accent rounded-2xl font-black text-black uppercase tracking-widest active:scale-95 transition-all">
                            ATUALIZAR SERVIÇOS
                        </button>
                    </div>
                )}

                {activeSheet === "cancel" && (
                    <div className="space-y-6 text-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-2xl">⚠️</div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white leading-tight">Deseja realmente cancelar?</h3>
                            <p className="text-white/40 text-sm">O cliente receberá uma notificação automática sobre o cancelamento.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={closeSheet} className="py-4 bg-white/5 rounded-2xl text-white font-black uppercase tracking-widest text-xs active:scale-95 transition-all">
                                MANTER
                            </button>
                            <button onClick={() => router.back()} className="py-4 bg-red-500 rounded-2xl text-white font-black uppercase tracking-widest text-xs active:scale-95 transition-all">
                                CONFIRMAR
                            </button>
                        </div>
                    </div>
                )}
            </AppointmentActionSheet>
        </main>
    );
}