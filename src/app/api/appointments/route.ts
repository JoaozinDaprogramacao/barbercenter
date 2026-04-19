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
            include: {
                services: true,
                barber: { select: { id: true, name: true } } // <-- BUSCA O NOME DO BARBEIRO
            },
            orderBy: { time: 'asc' }
        });

        const formattedAgenda: Record<string, any[]> = {};

        appointments.forEach(appt => {
            if (!formattedAgenda[appt.date]) formattedAgenda[appt.date] = [];

            const serviceNames = appt.services.map(s => s.name).join(", ");
            const totalPrice = appt.services.reduce((total, s) => total + s.price, 0);

            formattedAgenda[appt.date].push({
                id: appt.id,
                time: appt.time,
                name: appt.clientName,
                service: serviceNames,
                price: totalPrice,
                // 👇 AQUI: Mandamos o nome pro Frontend exibir no Card do Agendamento
                barberName: appt.barber?.name || "Não atribuído",
                barberId: appt.barber?.id
            });
        });

        return NextResponse.json({ agenda: formattedAgenda });
    } catch (error) {
        console.error("Erro no GET:", error);
        return NextResponse.json({ error: "Erro ao buscar" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // Pegamos serviceIds (array) em vez de serviceId
        const { clientName, serviceIds, date, time, barbershopId } = await req.json();

        // Criamos o formato que o Prisma exige para o connect: [{ id: "1" }, { id: "2" }]
        const connectServices = serviceIds.map((id: string) => ({ id }));

        const newAppointment = await prisma.appointment.create({
            data: {
                clientName,
                date,
                time,
                barbershopId,
                // Aqui conectamos a lista de serviços ao agendamento
                services: {
                    connect: connectServices
                }
            },
            include: {
                services: true // Retorna os dados para confirmarmos que deu certo
            }
        });

        return NextResponse.json({ message: "Criado!", appointment: newAppointment }, { status: 201 });
    } catch (error) {
        console.error("Erro no agendamento:", error);
        return NextResponse.json({ error: "Erro ao criar" }, { status: 500 });
    }
}