import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        // Sem getServerSession! Rota pública.
        const { clientName, serviceId, date, time, barbershopId } = await req.json();

        const newAppointment = await prisma.appointment.create({
            data: {
                clientName,
                date,
                time,
                serviceId,
                barbershopId // Usa o ID da barbearia que veio no link, não da sessão!
            }
        });

        return NextResponse.json({ success: true, appointment: newAppointment }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao agendar" }, { status: 500 });
    }
}