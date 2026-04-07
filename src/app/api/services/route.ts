import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.barbershopId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const services = await prisma.service.findMany({
            where: { barbershopId: session.user.barbershopId },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json({ services }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.barbershopId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const { id, name, price, duration } = await req.json();

        // Converte o preço que vem como string (ex: "3000" = R$ 30,00) para Float (30.00)
        const priceFloat = typeof price === 'string' ? parseFloat(price) / 100 : price;

        if (id && String(id).length > 15) { // Se o ID for longo (UUID do banco), é edição
            const updated = await prisma.service.update({
                where: { id: String(id) },
                data: { name, price: priceFloat, duration: Number(duration) }
            });
            return NextResponse.json({ service: updated }, { status: 200 });
        } else { // Senão, é criação
            const created = await prisma.service.create({
                data: {
                    name,
                    price: priceFloat,
                    duration: Number(duration),
                    barbershopId: session.user.barbershopId
                }
            });
            return NextResponse.json({ service: created }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.barbershopId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const { id } = await req.json();
        await prisma.service.delete({ where: { id: String(id) } });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 });
    }
}