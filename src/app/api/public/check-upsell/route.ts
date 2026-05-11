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

        // 🔥 NOVO: Descobre o que é a oferta e busca os detalhes (Nome e Preço)
        let offerName = "";
        let offerPrice = 0;
        let offerType = "";

        if (rule.offerServiceId) {
            const service = await prisma.service.findUnique({ where: { id: rule.offerServiceId } });
            offerName = service?.name || "Serviço";
            offerPrice = service?.price || 0;
            offerType = "SERVICE";
        } else if (rule.offerProductId) {
            const product = await prisma.product.findUnique({ where: { id: rule.offerProductId } });
            offerName = product?.name || "Produto";
            offerPrice = product?.price || 0;
            offerType = "PRODUCT";
        }

        // Retorna a regra turbinada com os dados prontos para a UI
        return NextResponse.json({ 
            upsell: {
                ...rule,
                offerName,
                offerPrice,
                offerType
            } 
        }, { status: 200 });
        
    } catch (error) {
        console.error("Erro ao checar upsell:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}