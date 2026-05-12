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

function getScheduledDate(dateStr: string): Date {
    if (!dateStr) return new Date(0);
    
    const parts = dateStr.toLowerCase().split(/[-/\s]/);
    const currentYear = new Date().getFullYear();

    if (parts.length >= 2) {
        if (parts[0].length === 4) {
            return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2] || "1"), 12, 0, 0);
        }

        const day = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10) - 1;
        
        if (isNaN(month)) {
            const monthMap: Record<string, number> = { "jan": 0, "fev": 1, "mar": 2, "abr": 3, "mai": 4, "jun": 5, "jul": 6, "ago": 7, "set": 8, "out": 9, "nov": 10, "dez": 11 };
            const m = parts[1].substring(0, 3);
            month = monthMap[m] !== undefined ? monthMap[m] : new Date().getMonth();
        }

        let year = currentYear;
        if (parts.length >= 3) {
            year = parts[2].length === 2 ? 2000 + parseInt(parts[2], 10) : parseInt(parts[2], 10);
        }

        return new Date(year, month, day, 12, 0, 0);
    }

    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date(0) : d;
}

// 🔥 Helper para pegar o valor REAL do agendamento (Respeitando descontos)
function getAppPrice(app: any) {
    if (app.price && app.price > 0) return app.price;
    // Fallback para agendamentos antigos
    const servicesTotal = (app.services || []).reduce((acc: number, s: any) => acc + s.price, 0);
    const productsTotal = (app.products || []).reduce((acc: number, p: any) => acc + p.price, 0);
    return servicesTotal + productsTotal;
}

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

        const allAppointments = await prisma.appointment.findMany({
            where: {
                barbershopId: session.user.barbershopId,
            },
            include: {
                services: true,
                products: true // 🔥 Busca os produtos vendidos também
            }
        });

        const appointments = allAppointments.filter(app => {
            const appDate = getScheduledDate(app.date);
            return appDate >= startDate && appDate <= endDate;
        });

        // 🔥 Calcula o faturamento usando o helper seguro (com descontos)
        const brutoTotal = appointments.reduce((acc, app) => acc + getAppPrice(app), 0);

        let chartData = [];

        if (timeframe === "semana") {
            chartData = eachDayOfInterval({ start: startDate, end: endDate }).map(day => {
                const dayApps = appointments.filter(app => {
                    const d = getScheduledDate(app.date);
                    return d.getDate() === day.getDate() && d.getMonth() === day.getMonth() && d.getFullYear() === day.getFullYear();
                });
                const total = dayApps.reduce((acc, app) => acc + getAppPrice(app), 0);
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
                    const d = getScheduledDate(app.date);
                    const day = d.getDate();
                    return day > (weekIndex * 7) && day <= ((weekIndex + 1) * 7 + (weekIndex === 3 ? 3 : 0));
                });
                const total = weekApps.reduce((acc, app) => acc + getAppPrice(app), 0);
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
                const monthApps = appointments.filter(app => {
                    const d = getScheduledDate(app.date);
                    return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
                });
                const total = monthApps.reduce((acc, app) => acc + getAppPrice(app), 0);
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

        // 🔥 Ranking de Vendas: Agrupa Serviços E Produtos vendidos!
        const serviceSummary = appointments.reduce((acc: any, app) => {
            const soldItems = [...(app.services || []), ...(app.products || [])];

            if (soldItems.length === 0) {
                const existing = acc.find((s: any) => s.name === "Outros");
                if (existing) existing.count += 1;
                else acc.push({ name: "Outros", count: 1 });
                return acc;
            }

            soldItems.forEach(item => {
                const existing = acc.find((s: any) => s.name === item.name);
                if (existing) existing.count += 1;
                else acc.push({ name: item.name, count: 1 });
            });
            
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