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
                products: true, // 🔥 Busca produtos vinculados
                barber: { select: { id: true, name: true } }
            },
            orderBy: { time: 'asc' }
        });

        const formattedAgenda: Record<string, any[]> = {};

        appointments.forEach(appt => {
            if (!formattedAgenda[appt.date]) formattedAgenda[appt.date] = [];

            // 🔥 Mistura Nomes de Serviços e Produtos para exibir na agenda
            const serviceNames = appt.services.map(s => s.name);
            const productNames = appt.products.map(p => p.name);
            const itemsSold = [...serviceNames, ...productNames].join(", ");

            // Se o appt.price já existir (gravado na hora do agendamento c/ desconto), usa ele.
            // Se for um agendamento antigo (sem appt.price salvo), soma na hora.
            let finalPrice = appt.price;
            if (!finalPrice || finalPrice === 0) {
                finalPrice = appt.services.reduce((t, s) => t + s.price, 0) + appt.products.reduce((t, p) => t + p.price, 0);
            }

            formattedAgenda[appt.date].push({
                id: appt.id,
                time: appt.time,
                name: appt.clientName,
                service: itemsSold, 
                price: finalPrice, // 🔥 Exibe o valor que foi de fato cobrado
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