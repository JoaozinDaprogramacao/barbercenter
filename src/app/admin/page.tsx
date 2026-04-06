"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { WeeklyCalendar } from "@/components/admin/dashboard/WeeklyCalendar";
import { SummaryCards } from "@/components/admin/dashboard/SummaryCards";
import { AppointmentCard } from "@/components/admin/dashboard/AppointmentCard";
import { Sidebar } from "@/components/admin/Sidebar";

// MOCKS
const MOCK_AGENDA: Record<string, any[]> = {
    "15": [{ id: 1, time: "14:00 - 14:40", name: "Carlos Silva", service: "CORTE & BARBA", price: 70.00 }],
    "16": [
        { id: 2, time: "09:00 - 09:40", name: "Lucas Paim", service: "CORTE", price: 44.90 },
        { id: 3, time: "09:40 - 10:20", name: "Alan Gonçalves", service: "CORTE", price: 30.00 },
        { id: 4, time: "10:20 - 10:50", name: "Will", service: "BARBA", price: 20.00 },
    ],
    "17": [{ id: 5, time: "10:00 - 10:40", name: "Marcos", service: "CORTE", price: 35.00 }]
};

const WEEK_DAYS = [
    { day: 'SEG', date: '15' }, { day: 'TER', date: '16' }, { day: 'QUA', date: '17' },
    { day: 'QUI', date: '18' }, { day: 'SEX', date: '19' }, { day: 'SAB', date: '20' },
];

export default function BarberDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showValues, setShowValues] = useState(true);
    const [selectedDate, setSelectedDate] = useState("16");

    const todaysAppointments = MOCK_AGENDA[selectedDate] || [];

    return (
        <main className="h-[100dvh] w-full flex flex-col bg-background max-w-md mx-auto relative overflow-hidden font-sans">

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <DashboardHeader
                userName="Alan"
                showValues={showValues}
                onToggleValues={() => setShowValues(!showValues)}
                onOpenMenu={() => setIsSidebarOpen(true)} // Abre o Sidebar
                onOpenSchedule={() => { }}
            />

            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                <WeeklyCalendar
                    days={WEEK_DAYS}
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                        console.log("Alterando data para:", date);
                        setSelectedDate(date);
                    }}
                    agendaData={MOCK_AGENDA}
                />

                <SummaryCards
                    showValues={showValues}
                    todayRevenue="R$ 320,00"
                    todayCount={16}
                    weekRevenue="R$ 4304,90"
                    weekCount={34}
                />

                {/* LISTA DE AGENDAMENTOS */}
                <div className="px-6 space-y-4">
                    {todaysAppointments.length > 0 ? (
                        todaysAppointments.map((appt) => (
                            <AppointmentCard
                                key={appt.id}
                                time={appt.time}
                                name={appt.name}
                                service={appt.service}
                                price={showValues ? `R$ ${appt.price.toFixed(2).replace('.', ',')}` : 'R$ •••••'}
                                badge={appt.badge}
                                onClick={() => console.log("Abrir modal para:", appt.name)}
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