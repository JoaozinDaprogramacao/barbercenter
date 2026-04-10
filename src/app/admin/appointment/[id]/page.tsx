"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

// Componentes da pasta admin/appointment
import { AppointmentHeader } from "@/components/admin/appointment/AppointmentHeader";
import { AppointmentInfoCard } from "@/components/admin/appointment/AppointmentInfoCard";
import { AppointmentActionSheet } from "@/components/admin/appointment/AppointmentActionSheet";

export default function AppointmentDetailPage() {
    const router = useRouter();
    const params = useParams();

    // Estados de controle da UI
    const [activeSheet, setActiveSheet] = useState<"date" | "services" | "cancel" | null>(null);
    const [reminderSent, setReminderSent] = useState(false);

    // Estados para dados reais da API
    const [appointment, setAppointment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Efeito para buscar os detalhes do agendamento ao carregar a página
    useEffect(() => {
        const fetchAppointmentDetail = async () => {
            setIsLoading(true);
            try {
                // Faz a chamada para sua rota de API dinâmica
                const res = await fetch(`/api/appointments/${params.id}`);
                if (!res.ok) throw new Error("Agendamento não encontrado");

                const data = await res.json();
                setAppointment(data);
            } catch (error) {
                console.error("Erro ao carregar detalhes do agendamento:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchAppointmentDetail();
        }
    }, [params.id]);

    const closeSheet = () => setActiveSheet(null);

    // Função para deletar/cancelar o agendamento
    const handleConfirmCancel = async () => {
        try {
            const res = await fetch(`/api/appointments/${params.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.back(); // Volta para o dashboard após deletar
            } else {
                alert("Erro ao cancelar o agendamento.");
            }
        } catch (error) {
            console.error("Erro ao cancelar:", error);
        }
    };

    // 1. Estado de Carregamento (Loading)
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    // 2. Estado caso o agendamento não exista
    if (!appointment) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-2xl">🔍</div>
                <h2 className="text-white font-bold text-xl mb-2">Agendamento não encontrado</h2>
                <p className="text-white/40 text-sm mb-6">Este registro pode ter sido removido ou o ID está incorreto.</p>
                <button
                    onClick={() => router.push('/admin')}
                    className="px-6 py-3 bg-accent rounded-xl text-black font-bold text-sm"
                >
                    VOLTAR PARA O INÍCIO
                </button>
            </div>
        );
    }

    // 3. Formatação dos dados para o componente AppointmentInfoCard
    // Adaptamos o que vem do seu backend para a estrutura que o componente espera
    const formattedData = {
        date: appointment.dateLabel || appointment.date, // Ex: "Qua, 17 de abr"
        time: appointment.time, // Ex: "09:00 às 09:40"
        client: {
            name: appointment.name || "Cliente",
            phone: appointment.phone || ""
        },
        services: appointment.services || [{ id: 1, name: appointment.service }],
        total: appointment.price || 0,
        paymentMethod: appointment.paymentMethod || "A definir"
    };

    return (
        <main className="min-h-screen w-full bg-background max-w-md mx-auto flex flex-col font-sans relative">

            <AppointmentHeader
                onBack={() => router.back()}
                onSendReminder={() => {
                    // Aqui você poderia disparar uma rota de API para enviar o zap
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

            {/* Gerenciamento dos Bottom Sheets dinâmicos */}
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
                            {/* Aqui você pode mapear os serviços disponíveis no seu sistema futuramente */}
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
                            <button onClick={handleConfirmCancel} className="py-4 bg-red-500 rounded-2xl text-white font-black uppercase tracking-widest text-xs active:scale-95 transition-all">
                                CONFIRMAR
                            </button>
                        </div>
                    </div>
                )}
            </AppointmentActionSheet>
        </main>
    );
}