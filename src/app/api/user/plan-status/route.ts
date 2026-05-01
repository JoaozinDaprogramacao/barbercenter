import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 🔥 MÁGICA AQUI: Diz ao Next.js para NUNCA fazer cache dessa rota
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { planStatus: true }
    });

    return NextResponse.json({ planStatus: user?.planStatus || 'FREE' });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar status" }, { status: 500 });
  }
}