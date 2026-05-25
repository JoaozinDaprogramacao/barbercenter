import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { differenceInDays } from "date-fns";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const barbershopId = searchParams.get('barbershopId');

        if (!barbershopId) {
            return NextResponse.json({ error: "BarbershopId é obrigatório" }, { status: 400 });
        }

        const clients = await prisma.client.findMany({
            where: { barbershopId },
            include: {
                appointments: {
                    select: { price: true, date: true },
                    orderBy: { date: 'desc' } // O mais recente primeiro
                }
            },
            orderBy: { name: 'asc' }
        });

        const enrichedClients = clients.map(client => {
            const totalSpent = client.appointments.reduce((acc, app) => acc + (app.price || 0), 0);
            
            let daysSinceLastVisit = null;
            if (client.appointments.length > 0) {
                // A data está como string 'YYYY-MM-DD'
                const lastAppDate = client.appointments[0].date; 
                daysSinceLastVisit = differenceInDays(new Date(), new Date(lastAppDate));
            }

            return {
                id: client.id,
                name: client.name,
                phone: client.phone,
                totalSpent,
                daysSinceLastVisit,
                totalVisits: client.appointments.length
            };
        });

        return NextResponse.json({ clients: enrichedClients });
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}