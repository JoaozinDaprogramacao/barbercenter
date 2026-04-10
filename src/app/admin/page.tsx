"use client";

import { useState, useMemo } from "react"; // Adicionei useMemo para performance
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { WeeklyCalendar } from "@/components/admin/dashboard/WeeklyCalendar";
import { SummaryCards } from "@/components/admin/dashboard/SummaryCards";
import { AppointmentCard } from "@/components/admin/dashboard/AppointmentCard";
import { CalendarPickerModal } from "@/components/admin/dashboard/CalendarPickerModal";
import { Sidebar } from "@/components/admin/Sidebar";

import { useAgenda } from "@/hooks/useAgenda";

// --- HELPERS ---
const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(date);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
};

const generateWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);

        // Gera o formato "10-abr" para bater com o seu JSON
        const dayNum = d.getDate().toString().padStart(2, '0');
        const monthShort = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
        const backendKey = `${dayNum}-${monthShort}`;

        days.push({
            day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', ''),
            date: dayNum,
            fullDate: backendKey // Agora a chave é "10-abr"
        });
    }
    return days;
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export default function BarberDashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { agendaData, isLoadingAgenda } = useAgenda();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showValues, setShowValues] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
    // No lugar de .toISOString().split('T')[0]
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        const day = d.getDate().toString().padStart(2, '0');
        const month = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
        return `${day}-${month}`;
    });

    const weekDays = generateWeekDays(currentWeekStart);

    // --- LÓGICA DE CÁLCULO DINÂMICO ---

    // 1. Dados do Dia Selecionado
    const todaysAppointments = agendaData[selectedDate] || [];
    const todayCount = todaysAppointments.length;
    const todayRevenue = useMemo(() => {
        const total = todaysAppointments.reduce((acc, appt) => acc + (appt.price || 0), 0);
        return formatCurrency(total);
    }, [todaysAppointments]);

    // 2. Dados da Semana (Soma todos os dias que aparecem no calendário atual)
    const weekStats = useMemo(() => {
        let totalRevenue = 0;
        let totalCount = 0;

        weekDays.forEach(day => {
            const dayAppointments = agendaData[day.fullDate] || [];
            totalCount += dayAppointments.length;
            totalRevenue += dayAppointments.reduce((acc, appt) => acc + (appt.price || 0), 0);
        });

        return {
            revenue: formatCurrency(totalRevenue),
            count: totalCount
        };
    }, [agendaData, weekDays]);

    // --- HANDLERS ---
    const firstName = status === "loading" ? "..." : session?.user?.name?.split(' ')[0] || "Barbeiro";

    const weekRangeText = `${weekDays[0].date} ${currentWeekStart.toLocaleDateString('pt-BR', { month: 'short' })} à ${weekDays[6].date} ${new Date(weekDays[6].fullDate + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' })}`;

    const nextWeek = () => {
        const next = new Date(currentWeekStart);
        next.setDate(next.getDate() + 7);
        setCurrentWeekStart(next);
    };

    const prevWeek = () => {
        const prev = new Date(currentWeekStart);
        prev.setDate(prev.getDate() - 7);
        setCurrentWeekStart(prev);
    };

    const handleJumpToDate = (dateString: string) => {
        if (!dateString) return;
        const chosenDate = new Date(dateString + 'T12:00:00');
        setCurrentWeekStart(getStartOfWeek(chosenDate));
        setSelectedDate(dateString);
    };

    return (
        <main className="min-h-screen w-full flex flex-col bg-background max-w-md mx-auto relative font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <DashboardHeader
                userName={firstName}
                showValues={showValues}
                onToggleValues={() => setShowValues(!showValues)}
                onOpenMenu={() => setIsSidebarOpen(true)}
                onOpenSchedule={() => { }}
            />

            <div className="flex-1 pb-24">
                <WeeklyCalendar
                    days={weekDays}
                    selectedDate={selectedDate} 
                    onSelectDate={(fullDate) => setSelectedDate(fullDate)}
                    onNextWeek={nextWeek}
                    onPrevWeek={prevWeek}
                    rangeText={weekRangeText}
                    agendaData={agendaData}
                    onOpenPicker={() => setIsCalendarOpen(true)}
                />

                <CalendarPickerModal
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)}
                    currentData={selectedDate}
                    onSelect={handleJumpToDate}
                />

                <SummaryCards
                    showValues={showValues}
                    todayRevenue={todayRevenue}
                    todayCount={todayCount}
                    weekRevenue={weekStats.revenue}
                    weekCount={weekStats.count}
                />

                <div className="px-6 space-y-4">
                    {isLoadingAgenda ? (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
                        </div>
                    ) : todaysAppointments.length > 0 ? (
                        todaysAppointments.map((appt) => (
                            <AppointmentCard
                                key={appt.id}
                                time={appt.time}
                                name={appt.name}
                                service={appt.service}
                                price={formatCurrency(appt.price)}
                                onClick={() => router.push(`/admin/appointment/${appt.id}`)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-text-secondary border border-white/5 rounded-3xl border-dashed">
                            Nenhum agendamento para este dia.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}