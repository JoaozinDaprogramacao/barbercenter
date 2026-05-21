import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma'; 

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