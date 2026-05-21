import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Use o caminho do seu prisma centralizado

// GET: Busca as notificações do barbeiro
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const barberId = searchParams.get('barberId');

        if (!barberId) {
            return NextResponse.json({ error: "Falta o barberId" }, { status: 400 });
        }

        // Pega as últimas 20 notificações
        const notifications = await prisma.notification.findMany({
            where: { barberId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        // Conta quantas não foram lidas
        // 🔥 CORREÇÃO AQUI: Adicionamos a tipagem explícita (n: { isRead: boolean })
        const unreadCount = notifications.filter((n: { isRead: boolean }) => !n.isRead).length;

        return NextResponse.json({ notifications, unreadCount }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar notificações" }, { status: 500 });
    }
}

// PATCH: Marca como lidas e limpa as antigas
export async function PATCH(req: Request) {
    try {
        const { barberId } = await req.json();

        if (!barberId) {
            return NextResponse.json({ error: "Falta o barberId" }, { status: 400 });
        }

        // 1. Marca todas as notificações desse barbeiro como lidas
        await prisma.notification.updateMany({
            where: {
                barberId,
                isRead: false
            },
            data: { isRead: true }
        });

        // 2. Limpeza (Opcional): Apaga notificações com mais de 7 dias para não inchar o banco
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        await prisma.notification.deleteMany({
            where: {
                barberId,
                createdAt: { lt: sevenDaysAgo }
            }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar notificações" }, { status: 500 });
    }
}