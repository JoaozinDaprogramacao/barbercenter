import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Não logado" }, { status: 401 });
        }

        // 1. Pega os dados reais do banco para garantir que a role está atualizada
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!currentUser?.barbershopId) {
            return NextResponse.json({ error: "Barbearia não encontrada" }, { status: 404 });
        }

        // 2. Busca a equipe inteira (Liberado para todos verem)
        const team = await prisma.user.findMany({
            where: { barbershopId: currentUser.barbershopId },
            select: { id: true, name: true, email: true, role: true }
        });

        // 3. Retorna a lista e avisa o front quem é esse usuário
        return NextResponse.json({ 
            members: team, 
            currentUserRole: currentUser.role 
        });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar equipe" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        // 👇 A BARREIRA DE SEGURANÇA: Se não for OWNER, a API rejeita na hora.
        if (currentUser?.role !== "OWNER") {
            return NextResponse.json({ error: "Apenas o dono pode adicionar membros." }, { status: 403 });
        }

        const { name, email, password } = await req.json();

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "E-mail já está em uso" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newBarber = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "BARBER",
                barbershopId: currentUser.barbershopId!
            }
        });

        return NextResponse.json({ message: "Barbeiro criado!", user: newBarber }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar barbeiro" }, { status: 500 });
    }
}