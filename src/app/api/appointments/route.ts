import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.barbershopId) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // Pega todos os agendamentos confirmados desta barbearia
        const appointments = await prisma.appointment.findMany({
            where: {
                barbershopId: session.user.barbershopId,
                status: "CONFIRMED"
            },
            orderBy: {
                time: 'asc' // Ordena pelo horário
            }
        });

        // Transforma o array do banco no formato do seu MOCK: { "2026-04-13": [{...}, {...}] }
        const formattedAgenda: Record<string, any[]> = {};
        
        appointments.forEach(appt => {
            if (!formattedAgenda[appt.date]) {
                formattedAgenda[appt.date] = [];
            }
            formattedAgenda[appt.date].push({
                id: appt.id,
                time: appt.time,
                name: appt.clientName,
                service: appt.service,
                price: appt.price
            });
        });

        return NextResponse.json({ agenda: formattedAgenda }, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar agenda:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // 1. Verifica quem está logado (Segurança Multi-tenant)
        const session = await getServerSession(authOptions);
        if (!session?.user?.barbershopId) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // 2. Pega os dados enviados no corpo da requisição
        const body = await req.json();
        const { clientName, service, price, date, time } = body;

        // Validação básica
        if (!clientName || !service || price === undefined || !date || !time) {
            return NextResponse.json({ error: "Preencha todos os campos obrigatórios" }, { status: 400 });
        }

        // 3. Salva no banco de dados atrelado à barbearia do usuário logado
        const newAppointment = await prisma.appointment.create({
            data: {
                clientName,
                service,
                price: parseFloat(price), // Garante que salva como número (Float)
                date,
                time,
                barbershopId: session.user.barbershopId, // O pulo do gato do SaaS!
            }
        });

        return NextResponse.json({ 
            message: "Agendamento criado com sucesso!", 
            appointment: newAppointment 
        }, { status: 201 });

    } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}