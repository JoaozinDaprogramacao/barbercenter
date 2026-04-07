import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.barbershopId) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const body = await req.json();
        
        // 👇 AQUI ESTÁ O SEGREDO: O businessHours precisa estar nesta desestruturação
        const { name, phone, address, businessHours } = body;

        const updatedBarbershop = await prisma.barbershop.update({
            where: { id: session.user.barbershopId },
            data: { 
                name, 
                phone, 
                address,
                businessHours // Agora ele acha a variável!
            }
        });

        return NextResponse.json({ message: "Atualizado com sucesso", barbershop: updatedBarbershop }, { status: 200 });
    } catch (error) {
        console.error("Erro no PUT da barbearia:", error);
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}

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