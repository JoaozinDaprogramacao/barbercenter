import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    eachDayOfInterval,
    format,
    addWeeks,
    addMonths,
    addYears,
    eachMonthOfInterval
} from "date-fns";
import { ptBR } from "date-fns/locale";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.barbershopId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const timeframe = searchParams.get("timeframe") || "mês";
        const offset = parseInt(searchParams.get("offset") || "0");

        const now = new Date();
        let startDate: Date;
        let endDate: Date;

        if (timeframe === "semana") {
            const baseDate = addWeeks(now, offset);
            startDate = startOfWeek(baseDate, { weekStartsOn: 0 });
            endDate = endOfWeek(baseDate, { weekStartsOn: 0 });
        } else if (timeframe === "mês") {
            const baseDate = addMonths(now, offset);
            startDate = startOfMonth(baseDate);
            endDate = endOfMonth(baseDate);
        } else {
            const baseDate = addYears(now, offset);
            startDate = startOfYear(baseDate);
            endDate = endOfYear(baseDate);
        }

        const appointments = await prisma.appointment.findMany({
            where: {
                barbershopId: session.user.barbershopId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            include: {
                service: true
            }
        });

        const brutoTotal = appointments.reduce((acc, app) => acc + (app.service?.price || 0), 0);

        let chartData = [];

        if (timeframe === "semana") {
            chartData = eachDayOfInterval({ start: startDate, end: endDate }).map(day => {
                const dayApps = appointments.filter(app => {
                    const d = new Date(app.createdAt);
                    return d.getDate() === day.getDate() && d.getMonth() === day.getMonth();
                });
                const total = dayApps.reduce((acc, app) => acc + (app.service?.price || 0), 0);
                return {
                    label: format(day, "eee", { locale: ptBR }).replace(".", ""),
                    atendimentos: dayApps.length,
                    bruto: total.toLocaleString('pt-BR'),
                    liquido: total.toLocaleString('pt-BR'),
                    height: brutoTotal > 0 ? `${Math.max((total / brutoTotal) * 100, 10)}%` : "0%"
                };
            });
        } else if (timeframe === "mês") {
            chartData = [0, 1, 2, 3].map(weekIndex => {
                const weekApps = appointments.filter(app => {
                    const day = new Date(app.createdAt).getDate();
                    return day > (weekIndex * 7) && day <= ((weekIndex + 1) * 7 + (weekIndex === 3 ? 3 : 0));
                });
                const total = weekApps.reduce((acc, app) => acc + (app.service?.price || 0), 0);
                return {
                    label: `Sem ${weekIndex + 1}`,
                    atendimentos: weekApps.length,
                    bruto: total.toLocaleString('pt-BR'),
                    liquido: total.toLocaleString('pt-BR'),
                    height: brutoTotal > 0 ? `${Math.max((total / brutoTotal) * 100, 10)}%` : "0%"
                };
            });
        } else {
            chartData = eachMonthOfInterval({ start: startDate, end: endDate }).map(month => {
                const monthApps = appointments.filter(app => new Date(app.createdAt).getMonth() === month.getMonth());
                const total = monthApps.reduce((acc, app) => acc + (app.service?.price || 0), 0);
                const label = format(month, "MMM", { locale: ptBR }).replace(".", "");
                return {
                    label: label.charAt(0).toUpperCase() + label.slice(1),
                    atendimentos: monthApps.length,
                    bruto: total.toLocaleString('pt-BR'),
                    liquido: total.toLocaleString('pt-BR'),
                    height: brutoTotal > 0 ? `${Math.max((total / brutoTotal) * 100, 10)}%` : "0%"
                };
            });
        }

        const serviceSummary = appointments.reduce((acc: any, app) => {
            const serviceName = app.service?.name || "Outros";
            const existing = acc.find((s: any) => s.name === serviceName);
            if (existing) existing.count += 1;
            else acc.push({ name: serviceName, count: 1 });
            return acc;
        }, []);

        return NextResponse.json({
            balance: {
                total: brutoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                bruto: brutoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                comissao: "(Total Real)",
                atendimentos: appointments.length
            },
            chartData,
            services: serviceSummary.sort((a: any, b: any) => b.count - a.count)
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}