import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.barbershopId) return NextResponse.json({ error: "401" }, { status: 401 });

        const appointments = await prisma.appointment.findMany({
            where: { barbershopId: session.user.barbershopId },
            include: { service: true }, // <-- TRAZ OS DADOS DO SERVIÇO JUNTO
            orderBy: { time: 'asc' }
        });

        const formattedAgenda: Record<string, any[]> = {};
        appointments.forEach(appt => {
            if (!formattedAgenda[appt.date]) formattedAgenda[appt.date] = [];
            formattedAgenda[appt.date].push({
                id: appt.id,
                time: appt.time,
                name: appt.clientName,
                service: appt.service.name, // Nome que vem da tabela Service
                price: appt.service.price    // Preço que vem da tabela Service
            });
        });

        return NextResponse.json({ agenda: formattedAgenda });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.barbershopId) return NextResponse.json({ error: "401" }, { status: 401 });

        const { clientName, serviceId, date, time } = await req.json();

        // 1. Criar o agendamento usando a relação (Connect)
        const newAppointment = await prisma.appointment.create({
            data: {
                clientName,
                date,
                time,
                barbershopId: session.user.barbershopId,
                // Em vez de usar service: { connect: { id: serviceId } }
                // Use diretamente o serviceId que definimos no Schema:
                serviceId: serviceId
            },
            include: {
                service: true
            }
        });

        return NextResponse.json({ message: "Criado!", appointment: newAppointment }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar" }, { status: 500 });
    }
}