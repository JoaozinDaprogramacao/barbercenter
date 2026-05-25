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
            include: { services: true, products: true, payments: true } 
        });

        if (!appointment) return NextResponse.json({ error: "404" }, { status: 404 });

        const serviceNames = appointment.services.map(s => s.name);
        const productNames = appointment.products.map(p => p.name);
        const allItems = [...serviceNames, ...productNames].join(", ");

        let finalPrice = appointment.price;
        if (!finalPrice || finalPrice === 0) {
            finalPrice = appointment.services.reduce((acc, s) => acc + s.price, 0) + appointment.products.reduce((acc, p) => acc + p.price, 0);
        }

        return NextResponse.json({
            id: appointment.id,
            barbershopId: appointment.barbershopId,
            date: appointment.date,
            time: appointment.time,
            name: appointment.clientName,
            status: appointment.status,
            service: allItems || "Nenhum item",
            price: finalPrice, 
            services: appointment.services,
            products: appointment.products,
            payments: appointment.payments 
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
        const updateData: any = { ...otherData };

        const currentAppt = await prisma.appointment.findUnique({
            where: { id: appointmentId as any },
            include: { services: true, products: true }
        });

        if (serviceIds && Array.isArray(serviceIds) && currentAppt) {
            const oldBasePrice = currentAppt.services.reduce((acc, s) => acc + s.price, 0) + 
                                 currentAppt.products.reduce((acc, p) => acc + p.price, 0);
            
            const discountApplied = oldBasePrice - (currentAppt.price || oldBasePrice);

            updateData.services = {
                set: serviceIds.map((sid: string) => ({ id: sid }))
            };

            const updated = await prisma.appointment.update({
                where: { id: appointmentId as any },
                data: updateData,
                include: { services: true, products: true, payments: true } 
            });

            const newBasePrice = updated.services.reduce((acc, s) => acc + s.price, 0) + 
                                 updated.products.reduce((acc, p) => acc + p.price, 0);

            const finalPrice = Math.max(0, newBasePrice - discountApplied);

            await prisma.appointment.update({
                where: { id: appointmentId as any },
                data: { price: finalPrice }
            });

            updated.price = finalPrice;
            return NextResponse.json(updated);
        }

        const updated = await prisma.appointment.update({
            where: { id: appointmentId as any },
            data: updateData,
            include: { services: true, products: true, payments: true }
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

        // Atualiza o status para CANCELED em vez de apagar do banco
        await prisma.appointment.update({
            where: { id: appointmentId as any },
            data: { status: "CANCELED" }
        });

        return NextResponse.json({ message: "Cancelado" });
    } catch (error: any) {
        return NextResponse.json({ error: "500" }, { status: 500 });
    }
}