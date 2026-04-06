"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { WeeklyCalendar } from "@/components/admin/dashboard/WeeklyCalendar";
import { SummaryCards } from "@/components/admin/dashboard/SummaryCards";
import { AppointmentCard } from "@/components/admin/dashboard/AppointmentCard";
import { CalendarPickerModal } from "@/components/admin/dashboard/CalendarPickerModal";
import { Sidebar } from "@/components/admin/Sidebar";

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
        days.push({
            day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', ''),
            date: d.getDate().toString().padStart(2, '0'),
            fullDate: d.toISOString().split('T')[0]
        });
    }
    return days;
};

const MOCK_AGENDA: Record<string, any[]> = {
    "2026-04-13": [{ id: 1, time: "14:00 - 14:40", name: "Carlos Silva", service: "CORTE & BARBA", price: 70.00 }],
    "2026-04-14": [
        { id: 2, time: "09:00 - 09:40", name: "Lucas Paim", service: "CORTE", price: 44.90 },
        { id: 3, time: "09:40 - 10:20", name: "Alan Gonçalves", service: "CORTE", price: 30.00 },
        { id: 4, time: "10:20 - 10:50", name: "Will", service: "BARBA", price: 20.00 },
    ],
    "2026-04-15": [{ id: 5, time: "10:00 - 10:40", name: "Marcos", service: "CORTE", price: 35.00 }]
};

const MOCK_STATS: Record<string, { todayRevenue: string; todayCount: number }> = {
    "2026-04-13": { todayRevenue: "R$ 70,00", todayCount: 1 },
    "2026-04-14": { todayRevenue: "R$ 94,90", todayCount: 3 },
    "2026-04-15": { todayRevenue: "R$ 35,00", todayCount: 1 },
};

export default function BarberDashboard() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showValues, setShowValues] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const weekDays = generateWeekDays(currentWeekStart);

    const weekRangeText = `${weekDays[0].date} ${currentWeekStart.toLocaleDateString('pt-BR', { month: 'short' })} à ${weekDays[6].date} ${new Date(weekDays[6].fullDate + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' })}`;

    const todaysAppointments = MOCK_AGENDA[selectedDate] || [];
    const currentDayStats = MOCK_STATS[selectedDate] || { todayRevenue: "R$ 0,00", todayCount: 0 };

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
        const newWeekStart = getStartOfWeek(chosenDate);
        setCurrentWeekStart(newWeekStart);
        setSelectedDate(dateString);
    };

    return (
        <main className="h-[100dvh] w-full flex flex-col bg-background max-w-md mx-auto relative overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <DashboardHeader
                userName="Alan"
                showValues={showValues}
                onToggleValues={() => setShowValues(!showValues)}
                onOpenMenu={() => setIsSidebarOpen(true)}
                onOpenSchedule={() => { }}
            />

            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                <WeeklyCalendar
                    days={weekDays}
                    selectedDate={selectedDate.split('-')[2]}
                    onSelectDate={(day) => {
                        const full = weekDays.find(d => d.date === day)?.fullDate;
                        if (full) setSelectedDate(full);
                    }}
                    onNextWeek={nextWeek}
                    onPrevWeek={prevWeek}
                    rangeText={weekRangeText}
                    agendaData={MOCK_AGENDA}
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
                    todayRevenue={currentDayStats.todayRevenue}
                    todayCount={currentDayStats.todayCount}
                    weekRevenue="R$ 4.304,90"
                    weekCount={34}
                />

                <div className="px-6 space-y-4">
                    {todaysAppointments.length > 0 ? (
                        todaysAppointments.map((appt) => (
                            <AppointmentCard
                                key={appt.id}
                                time={appt.time}
                                name={appt.name}
                                service={appt.service}
                                price={showValues ? `R$ ${appt.price.toFixed(2).replace('.', ',')}` : 'R$ •••••'}
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