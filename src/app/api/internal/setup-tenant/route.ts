import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma"; // Ajuste este caminho se o seu arquivo prisma.ts estiver em outro lugar

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { barbershopName, userName, userEmail, userPassword } = body;

    // Verifica se os dados vieram
    if (!barbershopName || !userName || !userEmail || !userPassword) {
      return NextResponse.json({ error: "Faltam dados!" }, { status: 400 });
    }

    // Hash da senha (segurança)
    const hashedPassword = await hash(userPassword, 10);

    // Cria a Barbearia e o Usuário de uma vez só!
    const newTenant = await prisma.barbershop.create({
      data: {
        name: barbershopName,
        users: {
          create: {
            name: userName,
            email: userEmail,
            password: hashedPassword,
            role: "OWNER"
          }
        }
      },
      include: { users: true }
    });

    return NextResponse.json({ 
      message: "Sucesso! SaaS rodando.", 
      tenant: newTenant 
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Deu ruim no servidor" }, { status: 500 });
  }
}