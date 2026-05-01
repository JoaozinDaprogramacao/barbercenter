import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, newPassword, adminKey } = await request.json();

    // 1. Validação da Chave Mestra
    if (adminKey !== process.env.ADMIN_MASTER_KEY) {
      return NextResponse.json({ error: "Acesso negado: Chave mestra inválida" }, { status: 403 });
    }

    if (!email || !newPassword) {
      return NextResponse.json({ error: "E-mail e nova senha são obrigatórios" }, { status: 400 });
    }

    // 2. Busca o usuário
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // 3. Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Atualiza no banco e limpa qualquer token antigo
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return NextResponse.json({ success: true, message: `Senha de ${email} alterada com sucesso!` });

  } catch (error: any) {
    return NextResponse.json({ error: "Erro interno", detalhes: error.message }, { status: 500 });
  }
}