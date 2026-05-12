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
            include: { services: true, products: true } // 🔥 Busca ambos
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
            products: appointment.products
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

        // 1. Busca o agendamento ANTES de alterar para descobrirmos se ele teve desconto
        const currentAppt = await prisma.appointment.findUnique({
            where: { id: appointmentId as any },
            include: { services: true, products: true }
        });

        // 2. Se o barbeiro está editando a lista de serviços...
        if (serviceIds && Array.isArray(serviceIds) && currentAppt) {
            // Calcula qual era o valor "cheio" (sem desconto)
            const oldBasePrice = currentAppt.services.reduce((acc, s) => acc + s.price, 0) + 
                                 currentAppt.products.reduce((acc, p) => acc + p.price, 0);
            
            // Descobre quanto de desconto de Upsell foi dado no chat
            const discountApplied = oldBasePrice - (currentAppt.price || oldBasePrice);

            updateData.services = {
                set: serviceIds.map((sid: string) => ({ id: sid }))
            };

            // Faz a atualização dos serviços no banco
            const updated = await prisma.appointment.update({
                where: { id: appointmentId as any },
                data: updateData,
                include: { services: true, products: true }
            });

            // Calcula o NOVO valor cheio (novos serviços + produtos mantidos)
            const newBasePrice = updated.services.reduce((acc, s) => acc + s.price, 0) + 
                                 updated.products.reduce((acc, p) => acc + p.price, 0);

            // Mantém o desconto antigo e gera o preço final!
            const finalPrice = Math.max(0, newBasePrice - discountApplied);

            // Salva o preço corrigido
            await prisma.appointment.update({
                where: { id: appointmentId as any },
                data: { price: finalPrice }
            });

            updated.price = finalPrice;
            return NextResponse.json(updated);
        }

        // Se ele está mudando apenas a Data/Hora (sem mexer nos serviços)
        const updated = await prisma.appointment.update({
            where: { id: appointmentId as any },
            data: updateData,
            include: { services: true, products: true }
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