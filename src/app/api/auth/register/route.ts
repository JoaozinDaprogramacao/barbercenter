import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { addDays } from "date-fns";
import { attributeReferral } from "@/lib/platform/affiliate";
import { REFERRAL_COOKIE } from "@/lib/platform/constants";
import { VISITOR_COOKIE } from "@/lib/platform/funnel";
import { linkVisitorToBarbershop, track } from "@/lib/platform/track";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { barbershopName, userName, userEmail, userPassword } = body;

        if (!barbershopName || !userName || !userEmail || !userPassword) {
            return NextResponse.json({ error: "Faltam dados!" }, { status: 400 });
        }

        const userExists = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        if (userExists) {
            return NextResponse.json({ error: "E-mail já cadastrado!" }, { status: 400 });
        }

        const hashedPassword = await hash(userPassword, 10);

        const trialDays = 45;
        const trialExpiresAt = addDays(new Date(), trialDays);

        const newTenant = await prisma.barbershop.create({
            data: {
                name: barbershopName,
                planStatus: "TRIAL",
                planExpiresAt: trialExpiresAt,
                users: {
                    create: {
                        name: userName,
                        email: userEmail,
                        password: hashedPassword,
                        role: "OWNER"
                    }
                }
            },
            include: {
                users: true
            }
        });

        // 🔗 Indicação: o código vem do cookie httpOnly plantado em /r/[code],
        // nunca do body. Se viesse do cliente, qualquer um se auto-indicaria
        // e a comissão de 50% viraria autoatendimento.
        const cookieStore = await cookies();
        const referralCode = cookieStore.get(REFERRAL_COOKIE)?.value;
        const referral = await attributeReferral(newTenant.id, referralCode);

        // 📊 Fecha o elo do funil: o rastro anônimo desta pessoa passa a
        // apontar para a barbearia criada. Sem isso, "clicou no link do Carlos"
        // e "virou pagante" ficariam em mundos separados.
        const visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
        if (visitorId) {
            await linkVisitorToBarbershop(visitorId, newTenant.id);
            await track(
                {
                    visitorId,
                    userAgent: req.headers.get("user-agent"),
                    referer: req.headers.get("referer"),
                    path: "/registro",
                },
                "SIGNUP_SUCCESS",
                { referralCode }
            );
        }

        const { password, ...userWithoutPassword } = newTenant.users[0];

        const response = NextResponse.json({
            message: "Sucesso! SaaS rodando.",
            tenant: {
                id: newTenant.id,
                name: newTenant.name,
                user: userWithoutPassword
            }
        }, { status: 201 });

        // Atribuiu, queima o cookie: ele já cumpriu o papel.
        if (referral) {
            response.cookies.set(REFERRAL_COOKIE, "", { maxAge: 0, path: "/" });
        }

        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Deu ruim no servidor" }, { status: 500 });
    }
}
