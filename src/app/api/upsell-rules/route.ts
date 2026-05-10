import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const barbershopId = searchParams.get('barbershopId');

        if (!barbershopId) {
            return NextResponse.json({ error: "ID da barbearia não fornecido" }, { status: 400 });
        }

        // Busca as regras e faz um "join" (include) para pegar os nomes dos serviços
        const rules = await prisma.upsellRule.findMany({
            where: { barbershopId, isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        // Como salvamos só os IDs na regra, vamos buscar os nomes reais dos serviços 
        // para exibir bonitinho na lista do Frontend
        const services = await prisma.service.findMany({
            where: { barbershopId }
        });

        const rulesWithNames = rules.map(rule => {
            const triggerService = services.find(s => s.id === rule.triggerServiceId);
            const offerService = services.find(s => s.id === rule.offerServiceId);

            return {
                ...rule,
                triggerName: triggerService?.name || "Serviço Removido",
                offerName: offerService?.name || "Serviço Removido"
            };
        });

        return NextResponse.json({ rules: rulesWithNames }, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar regras de upsell:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { barbershopId, triggerServiceId, offerServiceId, discountAmount, customCopy } = body;

        if (!barbershopId || !triggerServiceId || !offerServiceId || !discountAmount) {
            return NextResponse.json({ error: "Preencha todos os campos obrigatórios" }, { status: 400 });
        }

        const newRule = await prisma.upsellRule.create({
            data: {
                barbershopId,
                triggerServiceId,
                offerServiceId,
                discountAmount: parseFloat(discountAmount),
                customCopy,
                discountType: "PERCENTAGE" // Mantendo porcentagem como padrão inicial
            }
        });

        return NextResponse.json({ success: true, rule: newRule }, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar regra de upsell:", error);
        return NextResponse.json({ error: "Erro interno ao salvar oferta" }, { status: 500 });
    }
}