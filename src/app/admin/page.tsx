"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";

import EnableNotifications from "@/components/EnableNotifications";

import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { WeeklyCalendar } from "@/components/admin/dashboard/WeeklyCalendar";
import { SummaryCards } from "@/components/admin/dashboard/SummaryCards";
import { AppointmentCard } from "@/components/admin/dashboard/AppointmentCard";
import { CalendarPickerModal } from "@/components/admin/dashboard/CalendarPickerModal";
import { Sidebar } from "@/components/admin/settings/layout/Sidebar";
import { TrialBanner } from "@/components/TrialBanner";
import { TrialWorkflow } from "@/components/admin/settings/billing/TrialWorkflow";

import { useAgenda } from "@/hooks/useAgenda";

const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(date);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
};

const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const parseDateKey = (dateString: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    return new Date(dateString + "T12:00:00");
};

const generateWeekDays = (startDate: Date) => {
    const days = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);

        days.push({
            day: d.toLocaleDateString("pt-BR", { weekday: "short" }).toUpperCase().replace(".", ""),
            date: d.getDate().toString().padStart(2, "0"),
            fullDate: formatDateKey(d),
        });
    }

    return days;
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

export default function BarberDashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { agendaData, isLoadingAgenda } = useAgenda();

    const currentUser = {
        id: session?.user?.id as string,
        name: session?.user?.name as string,
        email: session?.user?.email as string,
        barbershopId: session?.user?.barbershopId as string,
    };

    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showValues, setShowValues] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
    const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));

    const weekDays = useMemo(() => {
        return generateWeekDays(currentWeekStart);
    }, [currentWeekStart]);

    const todaysAppointments = agendaData[selectedDate] || [];

    const todayCount = todaysAppointments.length;

    const todayRevenue = useMemo(() => {
        const total = todaysAppointments.reduce((acc, appt) => acc + (appt.price || 0), 0);
        return formatCurrency(total);
    }, [todaysAppointments]);

    const weekStats = useMemo(() => {
        let totalRevenue = 0;
        let totalCount = 0;

        weekDays.forEach((day) => {
            const dayAppointments = agendaData[day.fullDate] || [];

            totalCount += dayAppointments.length;
            totalRevenue += dayAppointments.reduce((acc, appt) => acc + (appt.price || 0), 0);
        });

        return {
            revenue: formatCurrency(totalRevenue),
            count: totalCount,
        };
    }, [agendaData, weekDays]);

    const firstName = status === "loading" ? "..." : session?.user?.name?.split(" ")[0] || "Barbeiro";

    const weekRangeText = `${weekDays[0].date} ${currentWeekStart.toLocaleDateString("pt-BR", {
        month: "short",
    })} à ${weekDays[6].date} ${new Date(
        currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("pt-BR", { month: "short" })}`;

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

        const chosenDate = parseDateKey(dateString);
        const formattedDate = formatDateKey(chosenDate);

        setCurrentWeekStart(getStartOfWeek(chosenDate));
        setSelectedDate(formattedDate);
    };

    return (
        <main className="min-h-screen w-full flex flex-col bg-[#050505] max-w-md mx-auto relative font-sans text-white">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="relative min-h-[560px] overflow-visible">
                <div
                    className="absolute inset-x-0 top-0 h-[500px] bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/imgs/barber-header.jpg')",
                    }}
                />

                <div className="absolute inset-x-0 top-0 h-[500px] bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.70)_45%,rgba(5,5,5,1)_100%)]" />
                <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_top,rgba(184,115,51,0.20),transparent_38%)]" />
                <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_top_right,rgba(212,154,98,0.12),transparent_32%)]" />

                <div className="relative z-20">
                    <DashboardHeader
                        userName={firstName}
                        showValues={showValues}
                        onToggleValues={() => setShowValues(!showValues)}
                        onOpenMenu={() => setIsSidebarOpen(true)}
                        onOpenSchedule={() => {}}
                    />

                    <div className="relative z-30 -mt-2">
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
                    </div>
                </div>
            </div>

            <div className="flex-1 pb-24">
                <TrialBanner onUpgradeClick={() => setIsUpgradeOpen(true)} />

                <TrialWorkflow
                    forcedOpen={isUpgradeOpen}
                    onClose={() => setIsUpgradeOpen(false)}
                    userData={currentUser}
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
                        <div className="text-center py-10 text-text-secondary border border-white/5 rounded-3xl border-dashed text-xs">
                            Nenhum agendamento para este dia.
                        </div>
                    )}

                    {/* Botão de Adicionar Agendamento */}
                    <button
                        onClick={() => router.push("/admin/agendar")}
                        className="w-full mt-4 py-4 bg-[#100D0B] hover:bg-white/[0.02] border border-white/10 text-[#D49A62] rounded-[1.2rem] font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Novo Agendamento
                    </button>

                    {/* 🔥 BOTÃO DE NOTIFICAÇÕES AQUI 🔥 */}
                    {/* Ele só vai aparecer se o barbeiro ainda não tiver ativado */}
                    <EnableNotifications barberId={currentUser.id} />
                </div>
            </div>
        </main>
    );
}