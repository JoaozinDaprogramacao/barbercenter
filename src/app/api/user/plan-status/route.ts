import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { planStatus: true } // Buscamos APENAS o status para ser bem leve
    });

    return NextResponse.json({ planStatus: user?.planStatus || 'FREE' });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar status" }, { status: 500 });
  }
}