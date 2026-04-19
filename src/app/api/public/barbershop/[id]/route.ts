import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: barbershopId } = await params;

        const barbershop = await prisma.barbershop.findUnique({
            where: { id: barbershopId },
            select: {
                name: true,
                businessHours: true,
                services: {
                    select: { id: true, name: true, price: true, duration: true }
                },
                // 👇 AQUI: Retorna os barbeiros disponíveis na loja
                users: {
                    select: { id: true, name: true, role: true }
                }
            }
        });

        if (!barbershop) {
            return NextResponse.json({ error: "Barbearia não encontrada" }, { status: 404 });
        }

        return NextResponse.json(barbershop, { status: 200 });
    } catch (error) {
        console.error("ERRO NA ROTA PUBLICA DE BARBEARIA:", error);
        return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
    }
}