import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const barbershopId = params.id;

        const barbershop = await prisma.barbershop.findUnique({
            where: { id: barbershopId },
            select: { 
                name: true,
                // Traz apenas os serviços dessa barbearia
                services: { 
                    select: { id: true, name: true, price: true, duration: true }
                } 
            }
        });

        if (!barbershop) return NextResponse.json({ error: "Barbearia não encontrada" }, { status: 404 });

        return NextResponse.json(barbershop, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
    }
}