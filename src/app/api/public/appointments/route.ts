import { NextResponse } from "next/server";
// Use o caminho relativo correto para o seu Prisma, conforme ajustamos antes
import { PrismaClient } from '@/generated/client'; 
import webpush from "web-push";

const prisma = new PrismaClient();

// 🔥 NOVO: Configuração do Web Push
// Importante: garanta que essas variáveis existam no seu .env
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

export async function POST(req: Request) {
    try {
        // 🔥 ATUALIZADO: Pegando productIds e totalPrice
        const { clientName, serviceIds, productIds, date, time, barbershopId, barberId, totalPrice } = await req.json();

        if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
            return NextResponse.json({ error: "Nenhum serviço selecionado" }, { status: 400 });
        }

        let assignedBarberId = barberId;

        if (!assignedBarberId) {
            const firstAvailableBarber = await prisma.user.findFirst({
                where: { barbershopId: barbershopId }
            });
            if (firstAvailableBarber) {
                assignedBarberId = firstAvailableBarber.id;
            }
        }

        const connectServices = serviceIds.map((id: string) => ({ id }));
        
        // Conexão segura de produtos caso existam
        const connectProducts = (productIds || []).map((id: string) => ({ id }));

        const newAppointment = await prisma.appointment.create({
            data: {
                clientName,
                date,
                time,
                barbershopId,
                barberId: assignedBarberId, 
                price: parseFloat(totalPrice) || 0, // 🔥 ATUALIZADO: Salva o preço real no banco
                services: {
                    connect: connectServices
                },
                // 🔥 ATUALIZADO: Conecta os produtos vendidos (upsell)
                products: connectProducts.length > 0 ? {
                    connect: connectProducts
                } : undefined
            },
            include: {
                services: true,
                products: true,
                barber: { select: { name: true } } 
            }
        });

        // 🔥 EXTRA: Se vendeu produto, abate do estoque
        if (connectProducts.length > 0) {
            await Promise.all(
                connectProducts.map(async (p: { id: string }) => {
                    await prisma.product.update({
                        where: { id: p.id },
                        data: { stock: { decrement: 1 } }
                    });
                })
            );
        }

        // ==========================================
        // 🔥 NOVO: DISPARO DA NOTIFICAÇÃO PUSH
        // ==========================================
        try {
            // 1. Busca todas as inscrições ativas DESTE barbeiro específico
            const subscriptions = await prisma.pushSubscription.findMany({
                where: { barberId: assignedBarberId }
            });

            if (subscriptions.length > 0) {
                // 2. Monta a mensagem
                const payload = JSON.stringify({
                    title: '✂️ Novo Agendamento!',
                    body: `${clientName} agendou para ${date} às ${time}.`,
                    url: '/painel/agenda' // Link para onde o barbeiro vai ao clicar na notificação
                });

                // 3. Dispara para todos os aparelhos do barbeiro (celular, PC, etc)
                const pushPromises = subscriptions.map(async (sub: any) => {
                    const pushConfig = {
                        endpoint: sub.endpoint,
                        keys: { p256dh: sub.p256dh, auth: sub.auth }
                    };

                    try {
                        await webpush.sendNotification(pushConfig, payload);
                    } catch (error: any) {
                        // Se o erro for 410 (Gone) ou 404 (Not Found), significa que 
                        // o barbeiro removeu a permissão no navegador. Limpamos o banco.
                        if (error.statusCode === 410 || error.statusCode === 404) {
                            await prisma.pushSubscription.delete({ where: { id: sub.id } });
                        } else {
                            console.error('Erro ao enviar push para endpoint:', sub.endpoint, error);
                        }
                    }
                });

                await Promise.all(pushPromises);
            }
        } catch (pushError) {
            // Envolvemos em um try/catch separado para que, se a notificação falhar,
            // o cliente ainda receba o "sucesso" do agendamento (status 201) abaixo.
            console.error('Erro geral ao processar notificações push:', pushError);
        }
        // ==========================================

        return NextResponse.json({ success: true, appointment: newAppointment }, { status: 201 });
    } catch (error) {
        console.error("Erro ao agendar via chat:", error);
        return NextResponse.json({ error: "Erro ao agendar" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');
        const barbershopId = searchParams.get('barbershopId');
        const barberId = searchParams.get('barberId');

        if (!date || !barbershopId) {
            return NextResponse.json({ error: "Faltam parâmetros" }, { status: 400 });
        }

        const whereClause: any = { barbershopId, date };

        if (barberId) whereClause.barberId = barberId;

        const appointments = await prisma.appointment.findMany({
            where: whereClause,
            include: {
                services: true
            }
        });

        const formattedAppointments = appointments.map((app: any) => {
            const totalDuration = app.services.reduce((acc: number, s: any) => acc + (s.duration || 30), 0);
            return {
                time: app.time,
                duration: totalDuration,
                barberId: app.barberId
            };
        });
        
        return NextResponse.json({ appointments: formattedAppointments }, { status: 200 });
    } catch (error) {
        console.error("Erro na busca de agendamentos:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}