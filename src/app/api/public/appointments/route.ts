import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import webpush from "web-push";

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

export async function POST(req: Request) {
    try {
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
        const connectProducts = (productIds || []).map((id: string) => ({ id }));

        const newAppointment = await prisma.appointment.create({
            data: {
                clientName,
                date,
                time,
                barbershopId,
                barberId: assignedBarberId, 
                price: parseFloat(totalPrice) || 0,
                services: {
                    connect: connectServices
                },
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

        try {
            const subscriptions = await prisma.pushSubscription.findMany({
                where: { barberId: assignedBarberId }
            });

            if (subscriptions.length > 0) {
                const payload = JSON.stringify({
                    title: '✂️ Novo Agendamento!',
                    body: `${clientName} agendou para ${date} às ${time}.`,
                    url: '/painel/agenda'
                });

                const pushPromises = subscriptions.map(async (sub: any) => {
                    const pushConfig = {
                        endpoint: sub.endpoint,
                        keys: { p256dh: sub.p256dh, auth: sub.auth }
                    };

                    try {
                        await webpush.sendNotification(pushConfig, payload);
                    } catch (error: any) {
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
            console.error('Erro geral ao processar notificações push:', pushError);
        }

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