import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        // Sem getServerSession! Rota pública.
        // ALTERAÇÃO: Recebendo serviceIds em vez de serviceId
        const { clientName, serviceIds, date, time, barbershopId } = await req.json();

        // Validação de segurança para garantir que veio uma lista de serviços
        if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
            return NextResponse.json({ error: "Nenhum serviço selecionado" }, { status: 400 });
        }

        // Transforma a lista de IDs no formato que o Prisma exige para criar a relação Many-to-Many
        const connectServices = serviceIds.map((id: string) => ({ id }));

        const newAppointment = await prisma.appointment.create({
            data: {
                clientName,
                date,
                time,
                barbershopId, // Usa o ID da barbearia que veio no link
                services: {
                    connect: connectServices // Aqui nós atrelamos todos os serviços escolhidos
                }
            },
            include: {
                services: true // Retorna os serviços junto para confirmar que deu certo
            }
        });

        return NextResponse.json({ success: true, appointment: newAppointment }, { status: 201 });
    } catch (error) {
        console.error("Erro ao agendar via chat:", error);
        return NextResponse.json({ error: "Erro ao agendar" }, { status: 500 });
    }
}