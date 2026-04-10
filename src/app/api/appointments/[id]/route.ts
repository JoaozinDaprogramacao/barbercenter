import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 1. BUSCAR DETALHES
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const appointmentId = isNaN(Number(id)) ? id : Number(id);

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId as any },
            include: { service: true }
        });

        if (!appointment) return NextResponse.json({ error: "404" }, { status: 404 });

        return NextResponse.json({
            id: appointment.id,
            barbershopId: appointment.barbershopId,
            date: appointment.date,
            time: appointment.time,
            name: appointment.clientName,
            service: appointment.service?.name || "Serviço",
            price: appointment.service?.price || 0,
        });
    } catch (error) {
        return NextResponse.json({ error: "500" }, { status: 500 });
    }
}

// 2. ATUALIZAR (O QUE ESTAVA FALTANDO)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { date, time } = await req.json();
        const appointmentId = isNaN(Number(id)) ? id : Number(id);

        const updated = await prisma.appointment.update({
            where: { id: appointmentId as any },
            data: {
                date: date,
                time: time
            }
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("ERRO_PATCH:", error.message);
        return NextResponse.json({ error: "500" }, { status: 500 });
    }
}

// 3. DELETAR
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.barbershopId) return NextResponse.json({ error: "401" }, { status: 401 });

        const { id } = await params;
        const appointmentId = isNaN(Number(id)) ? id : Number(id);

        await prisma.appointment.delete({
            where: { id: appointmentId as any }
        });

        return NextResponse.json({ message: "Deletado" });
    } catch (error: any) {
        return NextResponse.json({ error: "500" }, { status: 500 });
    }
}