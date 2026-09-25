// Cria (ou atualiza a senha de) um admin do console da plataforma.
//
// Deliberadamente um script de CLI e não uma rota HTTP: um endpoint de
// bootstrap é sempre a porta mais fraca do painel — fica esquecido no ar,
// aparece em scanner, e basta ele vazar pra alguém virar SUPERADMIN. Quem
// cria admin aqui precisa de acesso ao servidor e ao banco.
//
// Uso:
//   node scripts/create-platform-admin.js "Nome" email@dominio.com SUPERADMIN
//
// A senha é pedida via stdin (não vai pro histórico do shell).

require('dotenv/config');
const readline = require('readline');
const { hash } = require('bcryptjs');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('../src/generated/client');

const ROLES = ['SUPERADMIN', 'ANALYST'];
const MIN_PASSWORD_LENGTH = 12;

function prompt(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    if (hidden) {
      // Silencia o eco do terminal enquanto a senha é digitada.
      const onData = (char) => {
        if (['\n', '\r', ''].includes(char.toString())) {
          process.stdin.removeListener('data', onData);
        } else {
          process.stdout.write('\x1B[2K\x1B[200D' + question + '*'.repeat(rl.line.length));
        }
      };
      process.stdin.on('data', onData);
    }

    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(answer);
    });
  });
}

async function main() {
  const [name, email, roleArg] = process.argv.slice(2);
  const role = roleArg || 'SUPERADMIN';

  if (!name || !email) {
    console.error('Uso: node scripts/create-platform-admin.js "Nome" email@dominio.com [SUPERADMIN|ANALYST]');
    process.exit(1);
  }

  if (!ROLES.includes(role)) {
    console.error(`Role inválida: ${role}. Use SUPERADMIN ou ANALYST.`);
    process.exit(1);
  }

  const password = await prompt('Senha: ', { hidden: true });
  const confirm = await prompt('Confirme a senha: ', { hidden: true });

  if (password !== confirm) {
    console.error('As senhas não conferem.');
    process.exit(1);
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(`A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
    process.exit(1);
  }

  // allowPublicKeyRetrieval em localhost: o MySQL 8 usa caching_sha2_password
  // e, sem TLS, a conexão só autentica buscando a chave pública do servidor.
  // Ver o comentário longo em src/lib/prisma.ts.
  const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    allowPublicKeyRetrieval: ['localhost', '127.0.0.1', '::1'].includes(
      (process.env.DB_HOST ?? '').toLowerCase()
    ),
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const hashedPassword = await hash(password, 12);
    const normalizedEmail = email.trim().toLowerCase();

    const admin = await prisma.platformUser.upsert({
      where: { email: normalizedEmail },
      // Reexecutar o script reseta a senha e destrava a conta — é o caminho
      // de recuperação quando alguém erra a senha cinco vezes.
      update: {
        password: hashedPassword,
        name,
        role,
        isActive: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      create: { name, email: normalizedEmail, password: hashedPassword, role },
    });

    await prisma.adminAuditLog.create({
      data: {
        platformUserId: admin.id,
        actorEmail: normalizedEmail,
        action: 'PLATFORM_USER_PROVISIONED',
        targetType: 'PlatformUser',
        targetId: admin.id,
        metadata: { role, via: 'cli' },
      },
    });

    console.log(`\n✅ Admin pronto: ${admin.email} (${admin.role})`);
    console.log('   Acesse em /console/login');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('❌ Falhou:', error.message);
  process.exit(1);
});
