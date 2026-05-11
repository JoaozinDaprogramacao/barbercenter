import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const barbershopId = searchParams.get('barbershopId');
        
        // 🔥 AGORA RECEBEMOS O CARRINHO INTEIRO (IDs separados por vírgula)
        const cartIdsParam = searchParams.get('cartIds'); 

        if (!barbershopId || !cartIdsParam) {
            return NextResponse.json({ error: "Faltam parâmetros" }, { status: 400 });
        }

        const cartIds = cartIdsParam.split(',');

        // 1. Busca TODAS as regras ativadas por QUALQUER serviço que está no carrinho
        const allRules = await prisma.upsellRule.findMany({
            where: { 
                barbershopId, 
                triggerServiceId: { in: cartIds },
                isActive: true
            }
        });

        if (allRules.length === 0) {
            return NextResponse.json({ upsell: null }, { status: 200 });
        }

        // 2. FILTRO INTELIGENTE: Remove ofertas que o cliente JÁ adicionou no carrinho
        const validRules = allRules.filter(rule => {
            const offerId = rule.offerServiceId || rule.offerProductId;
            return !cartIds.includes(offerId as string);
        });

        if (validRules.length === 0) {
            return NextResponse.json({ upsell: null }, { status: 200 }); // Acabaram as ofertas
        }

        // 3. RESOLUÇÃO DE CONFLITO: Ordena pela oferta mais agressiva (Maior desconto)
        // Você pode mudar essa lógica depois para priorizar o item mais caro, se preferir
        validRules.sort((a, b) => b.discountAmount - a.discountAmount);
        
        // Pegamos a vencedora!
        const winningRule = validRules[0];

        // 4. Busca os dados de exibição da regra vencedora
        let offerName = "";
        let offerPrice = 0;
        let offerType = "";

        if (winningRule.offerServiceId) {
            const service = await prisma.service.findUnique({ where: { id: winningRule.offerServiceId } });
            offerName = service?.name || "Serviço Especial";
            offerPrice = service?.price || 0;
            offerType = "SERVICE";
        } else if (winningRule.offerProductId) {
            const product = await prisma.product.findUnique({ where: { id: winningRule.offerProductId } });
            offerName = product?.name || "Produto Especial";
            offerPrice = product?.price || 0;
            offerType = "PRODUCT";
        }

        return NextResponse.json({ 
            upsell: {
                ...winningRule,
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