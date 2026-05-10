import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const barbershopId = searchParams.get('barbershopId');

        if (!barbershopId) {
            return NextResponse.json({ error: "ID da barbearia não fornecido" }, { status: 400 });
        }

        const rules = await prisma.upsellRule.findMany({
            where: { barbershopId, isActive: true },
            orderBy: { createdAt: 'desc' }
        });

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
                discountType: "PERCENTAGE"
            }
        });

        return NextResponse.json({ success: true, rule: newRule }, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar regra de upsell:", error);
        return NextResponse.json({ error: "Erro interno ao salvar oferta" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, triggerServiceId, offerServiceId, discountAmount, customCopy } = body;

        if (!id) return NextResponse.json({ error: "ID da oferta é obrigatório" }, { status: 400 });

        const updatedRule = await prisma.upsellRule.update({
            where: { id },
            data: {
                triggerServiceId,
                offerServiceId,
                discountAmount: parseFloat(discountAmount),
                customCopy
            }
        });

        return NextResponse.json({ success: true, rule: updatedRule }, { status: 200 });
    } catch (error) {
        console.error("Erro ao atualizar regra de upsell:", error);
        return NextResponse.json({ error: "Erro interno ao atualizar oferta" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID da oferta é obrigatório" }, { status: 400 });

        await prisma.upsellRule.delete({
            where: { id }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Erro ao deletar regra de upsell:", error);
        return NextResponse.json({ error: "Erro interno ao deletar oferta" }, { status: 500 });
    }
}