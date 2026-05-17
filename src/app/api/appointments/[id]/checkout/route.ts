import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointmentId = parseInt(id, 10);
    
    const body = await request.json();
    const { serviceIds = [], productIds = [], payments = [] } = body;

    if (isNaN(appointmentId)) {
      return NextResponse.json({ error: "ID do agendamento inválido" }, { status: 400 });
    }

    if (!payments || payments.length === 0) {
      return NextResponse.json({ error: "É necessário informar pelo menos um pagamento" }, { status: 400 });
    }

    const totalPaid = payments.reduce((acc: number, curr: any) => acc + curr.amount, 0);

    // 🔥 O SEGREDO DO "EDITAR BAIXA" ESTÁ NESTA TRANSAÇÃO
    await prisma.$transaction(async (tx) => {
      
      // 1. Busca como o agendamento estava antes de editar
      const oldAppt = await tx.appointment.findUnique({
        where: { id: appointmentId },
        include: { products: true }
      });

      // 2. Se já tinha produtos, devolve eles pro estoque (estorno)
      if (oldAppt?.products && oldAppt.products.length > 0) {
        for (const p of oldAppt.products) {
          await tx.product.update({
            where: { id: p.id },
            data: { stock: { increment: 1 } }
          });
        }
      }

      // 3. APAGA os pagamentos antigos para não clonar / duplicar tela!
      await tx.payment.deleteMany({
        where: { appointmentId: appointmentId }
      });

      // 4. Salva a nova configuração zerada
      await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: "COMPLETED",
          price: totalPaid,
          
          services: {
            set: [], // Remove vínculos antigos
            connect: serviceIds.map((sid: string) => ({ id: sid }))
          },
          
          products: {
            set: [], // Remove vínculos antigos
            connect: productIds.map((pid: string) => ({ id: pid }))
          },

          payments: {
            create: payments.map((p: any) => ({
              amount: p.amount,
              paymentMethodId: p.methodId
            }))
          }
        }
      });

      // 5. Dá a baixa correta no estoque dos produtos da edição atual
      if (productIds.length > 0) {
        for (const productId of productIds) {
          await tx.product.update({
            where: { id: productId },
            data: { stock: { decrement: 1 } }
          });
        }
      }
    });

    return NextResponse.json({ success: true, message: "Baixa realizada/editada com sucesso!" });

  } catch (error: any) {
    console.error("Erro ao realizar checkout:", error);
    return NextResponse.json({ 
      error: "Falha ao processar o fechamento", 
      detalhes: error.message 
    }, { status: 500 });
  }
}