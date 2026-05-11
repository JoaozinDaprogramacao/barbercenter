import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const barbershopId = searchParams.get('barbershopId');

        if (!barbershopId) return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

        const products = await prisma.product.findMany({
            where: { barbershopId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { barbershopId, name, price, stock } = await req.json();

        if (!barbershopId || !name || !price) {
            return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                barbershopId,
                name,
                price: parseFloat(price),
                stock: parseInt(stock) || 0
            }
        });

        return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, name, price, stock } = await req.json();

        if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                price: parseFloat(price),
                stock: parseInt(stock) || 0
            }
        });

        return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

        await prisma.product.delete({ where: { id } });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 });
    }
}