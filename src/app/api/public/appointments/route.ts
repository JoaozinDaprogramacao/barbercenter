import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        // 👇 AQUI: Adicionamos a extração do barberId
        const { clientName, serviceIds, date, time, barbershopId, barberId } = await req.json();

        if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
            return NextResponse.json({ error: "Nenhum serviço selecionado" }, { status: 400 });
        }

        // 👇 AQUI: Lógica flexível para barbeiro único ou múltiplo
        let assignedBarberId = barberId;

        if (!assignedBarberId) {
            // Se não veio barbeiro especificado, pega o primeiro da loja
            const firstAvailableBarber = await prisma.user.findFirst({
                where: { barbershopId: barbershopId }
            });
            if (firstAvailableBarber) {
                assignedBarberId = firstAvailableBarber.id;
            }
        }

        const connectServices = serviceIds.map((id: string) => ({ id }));

        const newAppointment = await prisma.appointment.create({
            data: {
                clientName,
                date,
                time,
                barbershopId,
                barberId: assignedBarberId, // <-- Salva o barbeiro aqui
                services: {
                    connect: connectServices
                }
            },
            include: {
                services: true,
                barber: { select: { name: true } } // Confirmação visual no retorno
            }
        });

        return NextResponse.json({ success: true, appointment: newAppointment }, { status: 201 });
    } catch (error) {
        console.error("Erro ao agendar via chat:", error);
        return NextResponse.json({ error: "Erro ao agendar" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');
        const barbershopId = searchParams.get('barbershopId');
        const barberId = searchParams.get('barberId');

        if (!date || !barbershopId) {
            return NextResponse.json({ error: "Faltam parâmetros" }, { status: 400 });
        }

        // Filtra pela loja e data
        const whereClause: any = { barbershopId, date };

        // Se escolheu um barbeiro específico, filtra só a agenda dele
        if (barberId) whereClause.barberId = barberId;

        const appointments = await prisma.appointment.findMany({
            where: whereClause,
            // Precisamos dos serviços para saber a duração de cada agendamento feito!
            include: {
                services: true
            }
        });

        // Formata para o frontend
        const formattedAppointments = appointments.map((app) => {
            const totalDuration = app.services.reduce((acc, s) => acc + (s.duration || 30), 0);
            return {
                time: app.time,
                duration: totalDuration,
                barberId: app.barberId
            };
        });
        return NextResponse.json({ appointments: formattedAppointments }, { status: 200 });
    } catch (error) {
        console.error("Erro na busca de agendamentos:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}