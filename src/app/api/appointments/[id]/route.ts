import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const appointmentId = isNaN(Number(id)) ? id : Number(id);

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId as any },
            include: { services: true } // Alterado de service para services
        });

        if (!appointment) return NextResponse.json({ error: "404" }, { status: 404 });

        // Consolida nomes e preços de todos os serviços vinculados
        const serviceNames = appointment.services.map(s => s.name).join(", ");
        const totalPrice = appointment.services.reduce((acc, s) => acc + s.price, 0);

        return NextResponse.json({
            id: appointment.id,
            barbershopId: appointment.barbershopId,
            date: appointment.date,
            time: appointment.time,
            name: appointment.clientName,
            status: appointment.status,
            service: serviceNames || "Nenhum serviço",
            price: totalPrice,
            services: appointment.services // Retorna a lista completa para o front se necessário
        });
    } catch (error) {
        return NextResponse.json({ error: "500" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const appointmentId = isNaN(Number(id)) ? id : Number(id);

        const { serviceIds, ...otherData } = body;

        // Prepara os dados de atualização
        const updateData: any = { ...otherData };

        // Se vierem novos IDs de serviço, sobrescreve a lista atual
        if (serviceIds && Array.isArray(serviceIds)) {
            updateData.services = {
                set: serviceIds.map((sid: string) => ({ id: sid }))
            };
        }

        const updated = await prisma.appointment.update({
            where: { id: appointmentId as any },
            data: updateData,
            include: { services: true }
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("Erro no PATCH:", error);
        return NextResponse.json({ error: "500" }, { status: 500 });
    }
}

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