import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Definimos params como Promise
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.barbershopId) {
            return NextResponse.json({ error: "401" }, { status: 401 });
        }

        // --- AQUI ESTAVA O ERRO: Precisamos do await no params ---
        const { id } = await params;

        // Tenta converter para número, se falhar mantém como string
        const appointmentId = isNaN(Number(id)) ? id : Number(id);

        const appointment = await prisma.appointment.findUnique({
            where: {
                id: appointmentId as any
            },
            include: {
                service: true
            }
        });

        if (!appointment) {
            return NextResponse.json({ error: "404" }, { status: 404 });
        }

        const appt = appointment as any;

        return NextResponse.json({
            id: appt.id,
            dateLabel: appt.date,
            time: appt.time,
            name: appt.clientName,
            phone: "5541999999999",
            service: appt.service?.name || "Serviço",
            price: appt.service?.price || 0,
            paymentMethod: "Presencial"
        });

    } catch (error: any) {
        console.error("CRITICAL_ERROR_DETAILS:", error);
        return NextResponse.json({
            error: "500",
            message: error.message
        }, { status: 500 });
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