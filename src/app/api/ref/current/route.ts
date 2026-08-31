import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { REFERRAL_COOKIE, normalizeAffiliateCode } from "@/lib/platform/constants";

export const dynamic = "force-dynamic";

/**
 * Diz para a landing quem indicou o visitante, para a página conseguir dizer
 * "o Carlos usa isso na barbearia dele" em vez de tratar tráfego de embaixador
 * igual a tráfego frio.
 *
 * O cookie é httpOnly — o front não consegue lê-lo — então essa leitura precisa
 * acontecer no servidor. Como a LP é estática, ela chama esta rota em vez de
 * virar dinâmica só por causa da tarja.
 *
 * Devolve SOMENTE nome público, @ e código. E-mail, telefone, CPF e chave PIX
 * do embaixador nunca saem daqui: é endpoint sem autenticação, qualquer um com
 * um cookie forjado bate nele.
 */
export async function GET() {
    try {
        const store = await cookies();
        const raw = store.get(REFERRAL_COOKIE)?.value;
        if (!raw) return NextResponse.json({ referral: null });

        const code = normalizeAffiliateCode(raw);
        if (!code) return NextResponse.json({ referral: null });

        const affiliate = await prisma.affiliate.findUnique({
            where: { code },
            select: { code: true, name: true, instagram: true, status: true },
        });

        if (!affiliate || affiliate.status !== "ACTIVE") {
            return NextResponse.json({ referral: null });
        }

        return NextResponse.json({
            referral: {
                code: affiliate.code,
                name: affiliate.name,
                instagram: affiliate.instagram,
            },
        });
    } catch (error) {
        console.error("Erro ao resolver indicação:", error);
        // Falhar aqui não pode quebrar a landing — sem tarja é melhor que erro.
        return NextResponse.json({ referral: null });
    }
}
