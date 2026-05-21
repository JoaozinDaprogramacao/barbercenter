import { NextResponse } from 'next/server';
// 🔥 IMPORTANTE: Importe o SEU prisma centralizado (use o caminho correto de onde esse arquivo está salvo)
// Como ele usa "export default", importamos sem as chaves { }
import prisma from '@/lib/prisma'; 

// ❌ REMOVEMOS as linhas antigas:
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { barberId, subscription } = await request.json();

    const endpoint = subscription.endpoint;
    const p256dh = subscription.keys.p256dh;
    const auth = subscription.keys.auth;

    // Agora vai rodar usando o seu adaptador correto do MariaDB
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { barberId, p256dh, auth },
      create: { barberId, endpoint, p256dh, auth }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao salvar inscrição' }, { status: 500 });
  }
}