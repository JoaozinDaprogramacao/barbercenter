import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// app/api/appointments/[id]/route.ts

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const appointment = await prisma.appointment.findUnique({
            where: { id: Number(id) },
            include: {
                service: true,
                // barbershop: true // Opcional, mas o barbershopId já vem por padrão se você não usar 'select'
            }
        });

        if (!appointment) return NextResponse.json({ error: "404" }, { status: 404 });

        // Retorne o objeto GARANTINDO que o barbershopId está lá
        return NextResponse.json({
            id: appointment.id,
            barbershopId: appointment.barbershopId, // <--- CERTIFIQUE-SE DISSO
            date: appointment.date,
            time: appointment.time,
            name: appointment.clientName,
            service: appointment.service.name,
            price: appointment.service.price,
        });
    } catch (error) {
        return NextResponse.json({ error: "500" }, { status: 500 });
    }
}
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Mesma coisa aqui
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.barbershopId) return NextResponse.json({ error: "401" }, { status: 401 });

        const { id } = await params; // Aguardamos o id
        const appointmentId = isNaN(Number(id)) ? id : Number(id);

        await prisma.appointment.delete({
            where: { id: appointmentId as any }
        });

        return NextResponse.json({ message: "Deletado" });
    } catch (error: any) {
        return NextResponse.json({ error: "500" }, { status: 500 });
    }
}