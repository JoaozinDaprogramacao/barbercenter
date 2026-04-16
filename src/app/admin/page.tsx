"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { WeeklyCalendar } from "@/components/admin/dashboard/WeeklyCalendar";
import { SummaryCards } from "@/components/admin/dashboard/SummaryCards";
import { AppointmentCard } from "@/components/admin/dashboard/AppointmentCard";
import { CalendarPickerModal } from "@/components/admin/dashboard/CalendarPickerModal";
import { Sidebar } from "@/components/admin/Sidebar";
import { useAgenda } from "@/hooks/useAgenda";

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
        const dayNum = d.getDate().toString().padStart(2, '0');
        const monthShort = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
        const backendKey = `${dayNum}-${monthShort}`;
        days.push({
            day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', ''),
            date: dayNum,
            fullDate: backendKey
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
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        const day = d.getDate().toString().padStart(2, '0');
        const month = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
        return `${day}-${month}`;
    });

    const weekDays = generateWeekDays(currentWeekStart);

    const todaysAppointments = agendaData[selectedDate] || [];
    const todayCount = todaysAppointments.length;
    
    const todayRevenue = useMemo(() => {
        const total = todaysAppointments.reduce((acc, appt) => acc + (appt.price || 0), 0);
        return formatCurrency(total);
    }, [todaysAppointments]);

    const weekStats = useMemo(() => {
        let totalRevenue = 0;
        let totalCount = 0;
        weekDays.forEach(day => {
            const dayAppointments = agendaData[day.fullDate] || [];
            totalCount += dayAppointments.length;
            totalRevenue += dayAppointments.reduce((acc, appt) => acc + (appt.price || 0), 0);
        });
        return { revenue: formatCurrency(totalRevenue), count: totalCount };
    }, [agendaData, weekDays]);

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
        <main className="min-h-screen w-full flex flex-col bg-black max-w-md mx-auto relative overflow-x-hidden font-sans border-x border-zinc-900">
            
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-40 left-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full" />
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="z-10">
                <DashboardHeader
                    userName={firstName}
                    showValues={showValues}
                    onToggleValues={() => setShowValues(!showValues)}
                    onOpenMenu={() => setIsSidebarOpen(true)}
                    onOpenSchedule={() => { }}
                />

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 pb-24"
                >
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

                    <div className="px-6 py-4">
                        <SummaryCards
                            showValues={showValues}
                            todayRevenue={todayRevenue}
                            todayCount={todayCount}
                            weekRevenue={weekStats.revenue}
                            weekCount={weekStats.count}
                        />
                    </div>

                    <div className="px-6 space-y-3 mt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-black uppercase text-[11px] tracking-[0.2em] opacity-50">Agenda de Hoje</h3>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {isLoadingAgenda ? (
                                <div className="flex justify-center py-20">
                                    <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                                </div>
                            ) : todaysAppointments.length > 0 ? (
                                todaysAppointments.map((appt, idx) => (
                                    <motion.div
                                        key={appt.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="will-change-transform"
                                    >
                                        <AppointmentCard
                                            time={appt.time}
                                            name={appt.name}
                                            service={appt.service}
                                            price={formatCurrency(appt.price)}
                                            onClick={() => router.push(`/admin/appointment/${appt.id}`)}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16 text-zinc-500 border border-zinc-900 rounded-[2.5rem] bg-zinc-900/20 border-dashed"
                                >
                                    <p className="text-sm font-medium">Nenhum agendamento para hoje</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}