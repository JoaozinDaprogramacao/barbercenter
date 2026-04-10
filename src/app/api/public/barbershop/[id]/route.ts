import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Note que a tipagem do params mudou para Promise<{ id: string }>
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 👇 O PULO DO GATO DO NEXT.JS 15: await no params!
        const { id: barbershopId } = await params;

        const barbershop = await prisma.barbershop.findUnique({
            where: { id: barbershopId },
            select: {
                name: true,
                businessHours: true, // <--- AQUI ESTÁ A SOLUÇÃO!
                services: {
                    select: { id: true, name: true, price: true, duration: true }
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