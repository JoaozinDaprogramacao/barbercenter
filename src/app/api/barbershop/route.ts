import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // <-- IMPORTANTE: Ajuste o caminho se a sua pasta api não estiver dentro de app

export async function GET() {
    try {
        // Passamos o authOptions aqui!
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.barbershopId) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const barbershop = await prisma.barbershop.findUnique({
            where: { id: session.user.barbershopId }
        });

        return NextResponse.json({ barbershop }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        // Passamos o authOptions aqui também!
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.barbershopId) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone, address } = body;

        const updatedBarbershop = await prisma.barbershop.update({
            where: { id: session.user.barbershopId },
            data: { name, phone, address }
        });

        return NextResponse.json({ message: "Atualizado com sucesso", barbershop: updatedBarbershop }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}