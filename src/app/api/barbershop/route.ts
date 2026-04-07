import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Rota para ATUALIZAR os dados da barbearia
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { barbershopId, name, phone, address } = body;

    // Validação básica
    if (!barbershopId) {
      return NextResponse.json({ error: "O ID da barbearia é obrigatório" }, { status: 400 });
    }

    // Atualiza os dados no banco usando o ID
    const updatedBarbershop = await prisma.barbershop.update({
      where: { 
        id: barbershopId 
      },
      data: { 
        name, 
        phone, 
        address 
      }
    });

    return NextResponse.json({ 
      message: "Dados da barbearia atualizados com sucesso!", 
      barbershop: updatedBarbershop 
    }, { status: 200 });

  } catch (error) {
    console.error("Erro ao atualizar barbearia:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}