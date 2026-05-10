import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const barbershopId = searchParams.get('barbershopId');
        const serviceId = searchParams.get('serviceId');

        if (!barbershopId || !serviceId) {
            return NextResponse.json({ error: "Faltam parâmetros" }, { status: 400 });
        }

        // Busca se a barbearia configurou alguma regra para o serviço que o cara escolheu
        const rule = await prisma.upsellRule.findFirst({
            where: { 
                barbershopId, 
                triggerServiceId: serviceId,
                isActive: true
            }
        });

        if (!rule) {
            return NextResponse.json({ upsell: null }, { status: 200 });
        }

        return NextResponse.json({ upsell: rule }, { status: 200 });
    } catch (error) {
        console.error("Erro ao checar upsell:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}