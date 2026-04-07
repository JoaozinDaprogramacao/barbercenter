import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { barbershopName, userName, userEmail, userPassword } = body;

    // Verifica se os dados vieram
    if (!barbershopName || !userName || !userEmail || !userPassword) {
      return NextResponse.json({ error: "Faltam dados!" }, { status: 400 });
    }

    // Evita erro 500 do Prisma caso o e-mail já exista
    const userExists = await prisma.user.findUnique({ where: { email: userEmail } });
    if (userExists) {
      return NextResponse.json({ error: "E-mail já cadastrado!" }, { status: 400 });
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
            role: "OWNER" // Lembre-se: o campo 'role' precisa existir no schema.prisma!
          }
        }
      },
      include: { users: true }
    });

    // Remove a senha antes de devolver no JSON
    const { password, ...userWithoutPassword } = newTenant.users[0];

    return NextResponse.json({
      message: "Sucesso! SaaS rodando.",
      tenant: {
        id: newTenant.id,
        name: newTenant.name,
        user: userWithoutPassword
      }
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Deu ruim no servidor" }, { status: 500 });
  }
}