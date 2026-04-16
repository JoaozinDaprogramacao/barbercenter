import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

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
      include: { 
        users: true 
      }
    });

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