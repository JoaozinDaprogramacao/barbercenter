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
                products: {
                    // 👇 CORREÇÃO: Adicionado o 'stock' para o frontend saber se pode vender
                    select: { id: true, name: true, price: true, stock: true } 
                },
                users: {
                    select: { id: true, name: true, role: true }
                }
            }
        });

        if (!barbershop) {
            return NextResponse.json({ error: "Barbearia não encontrada" }, { status: 404 });
        }

        // 👇 O SEGREDO REVELADO: Buscar as formas de pagamento globais ativas no banco
        const paymentMethods = await prisma.paymentMethod.findMany({
            where: { isActive: true },
            select: { id: true, name: true }
        });

        // 👇 INJEÇÃO: Retorna tudo da barbearia + a lista de formas de pagamento
        return NextResponse.json({
            ...barbershop,
            paymentMethods
        }, { status: 200 });

    } catch (error) {
        console.error("ERRO NA ROTA PUBLICA DE BARBEARIA:", error);
        return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
    }
}