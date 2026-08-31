// Popula o banco local com dados de demonstração para testar o app da
// barbearia (/admin) e o console da plataforma (/console).
//
// Uso:
//   npm run seed:demo            cria os dados
//   npm run seed:demo -- --clean remove só o que este script criou
//
// Tudo que o seed cria é marcado pelo domínio de e-mail DEMO_DOMAIN e pelo
// prefixo DEMO_ nos códigos de afiliado. O --clean se guia por essas marcas,
// então dado real seu nunca entra na varredura.

require('dotenv/config');
const { hash } = require('bcryptjs');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('../src/generated/client');

const DEMO_DOMAIN = '@demo.barbercenter.local';
const DEMO_CODE_PREFIX = 'DEMO';
const SENHA_BARBEARIA = 'Demo@123456';
const SENHA_CONSOLE = 'Console@123456';
const PLANO_CENTAVOS = 3290;

const DEFAULT_HOURS = [
  { day: 0, label: 'Domingo', isOpen: false, openTime: '09:00', lunchStart: '12:00', lunchEnd: '13:00', closeTime: '13:00' },
  { day: 1, label: 'Segunda', isOpen: true, openTime: '09:00', lunchStart: '12:00', lunchEnd: '13:00', closeTime: '19:00' },
  { day: 2, label: 'Terça', isOpen: true, openTime: '09:00', lunchStart: '12:00', lunchEnd: '13:00', closeTime: '19:00' },
  { day: 3, label: 'Quarta', isOpen: true, openTime: '09:00', lunchStart: '12:00', lunchEnd: '13:00', closeTime: '19:00' },
  { day: 4, label: 'Quinta', isOpen: true, openTime: '09:00', lunchStart: '12:00', lunchEnd: '13:00', closeTime: '19:00' },
  { day: 5, label: 'Sexta', isOpen: true, openTime: '09:00', lunchStart: '12:00', lunchEnd: '13:00', closeTime: '20:00' },
  { day: 6, label: 'Sábado', isOpen: true, openTime: '08:00', lunchStart: '12:00', lunchEnd: '13:00', closeTime: '17:00' },
];

// PRNG com semente fixa: rodar o seed duas vezes gera os mesmos números, então
// dá pra comparar uma tela de ontem com a de hoje sem o ruído do Math.random.
let seed = 20260831;
function rand() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (min, max) => min + Math.floor(rand() * (max - min + 1));

const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
const daysAhead = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const competenceOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const NOMES = ['Lucas Paim', 'Rafael Souza', 'Bruno Alves', 'Diego Martins', 'Thiago Nunes', 'Marcelo Dias',
  'Felipe Rocha', 'André Lima', 'Gustavo Reis', 'Paulo Henrique', 'Vinícius Costa', 'Rodrigo Farias',
  'Matheus Silva', 'Caio Ribeiro', 'Leonardo Prado', 'Eduardo Campos', 'Fernando Braga', 'Igor Teixeira',
  'Renato Moura', 'Samuel Fontes', 'Otávio Pires', 'Danilo Xavier', 'Murilo Cardoso', 'Alan Bezerra'];

const SERVICOS = [
  { name: 'Corte Masculino', price: 45, duration: 40 },
  { name: 'Corte + Barba', price: 70, duration: 60 },
  { name: 'Barba Terapia', price: 40, duration: 30 },
  { name: 'Pezinho', price: 15, duration: 15 },
  { name: 'Platinado', price: 180, duration: 120 },
  { name: 'Sobrancelha', price: 20, duration: 15 },
];

const PRODUTOS = [
  { name: 'Pomada Modeladora', price: 45, stock: 22, commissionType: 'PERCENTAGE', commissionValue: 15 },
  { name: 'Óleo para Barba', price: 38, stock: 14, commissionType: 'PERCENTAGE', commissionValue: 20 },
  { name: 'Shampoo Anticaspa', price: 32, stock: 30, commissionType: 'FIXED', commissionValue: 5 },
  { name: 'Minoxidil 60ml', price: 89, stock: 8, commissionType: 'PERCENTAGE', commissionValue: 10 },
];

const HORARIOS = ['08:00', '09:00', '09:30', '10:00', '11:00', '13:00', '14:00', '14:30', '15:00', '16:00', '17:00', '18:00'];

function prisma() {
  return new PrismaClient({
    // allowPublicKeyRetrieval: ver o comentário em src/lib/prisma.ts — sem
    // isso o MySQL 8 recusa a autenticação e o erro aparece como pool timeout.
    adapter: new PrismaMariaDb({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      allowPublicKeyRetrieval: ['localhost', '127.0.0.1', '::1'].includes(
        (process.env.DB_HOST ?? '').toLowerCase()
      ),
    }),
  });
}

async function clean(db) {
  console.log('Removendo dados de demonstração...\n');

  // As barbearias são achadas pelo e-mail do dono; o cascade do schema derruba
  // usuários, serviços, produtos, clientes, agendamentos, pagamentos,
  // indicações, transações e comissões junto.
  const donos = await db.user.findMany({
    where: { email: { endsWith: DEMO_DOMAIN } },
    select: { barbershopId: true },
  });
  const ids = [...new Set(donos.map((u) => u.barbershopId))];

  if (ids.length) {
    const r = await db.barbershop.deleteMany({ where: { id: { in: ids } } });
    console.log(`  barbearias removidas: ${r.count}`);
  } else {
    console.log('  barbearias removidas: 0');
  }

  const afiliados = await db.affiliate.deleteMany({ where: { code: { startsWith: DEMO_CODE_PREFIX } } });
  console.log(`  afiliados removidos: ${afiliados.count}`);

  // Os misses do seed usam códigos com o mesmo prefixo (typos dos demos),
  // então o filtro pega os de demonstração sem tocar nos reais.
  const perdidos = await db.referralMiss.deleteMany({ where: { code: { startsWith: DEMO_CODE_PREFIX } } });
  console.log(`  cliques perdidos removidos: ${perdidos.count}`);

  // Visitantes do funil: os de embaixador somem junto com o afiliado (FK
  // SetNull não apaga), então a marca no landingPath é o que pega todos.
  const visitantes = await db.visitor.deleteMany({
    where: {
      OR: [
        { landingPath: '/?seed=demo' },
        ...(ids.length ? [{ barbershopId: { in: ids } }] : []),
      ],
    },
  });
  console.log(`  visitantes do funil removidos: ${visitantes.count}`);

  const admins = await db.platformUser.deleteMany({ where: { email: { endsWith: DEMO_DOMAIN } } });
  console.log(`  admins de console removidos: ${admins.count}`);

  const logs = await db.adminAuditLog.deleteMany({ where: { actorEmail: { endsWith: DEMO_DOMAIN } } });
  console.log(`  logs de auditoria removidos: ${logs.count}`);
}

async function seedFormasPagamento(db) {
  const nomes = ['Dinheiro', 'PIX', 'Cartão de Débito', 'Cartão de Crédito'];
  const out = [];
  for (const name of nomes) {
    out.push(await db.paymentMethod.upsert({ where: { name }, update: {}, create: { name } }));
  }
  return out;
}

/** Cria uma barbearia completa: equipe, catálogo, clientes e agenda. */
async function seedBarbearia(db, cfg, formasPagamento) {
  const senha = await hash(SENHA_BARBEARIA, 10);

  const shop = await db.barbershop.create({
    data: {
      name: cfg.nome,
      phone: cfg.telefone,
      address: cfg.endereco,
      businessHours: DEFAULT_HOURS,
      planStatus: cfg.planStatus,
      planExpiresAt: cfg.planExpiresAt,
      createdAt: cfg.createdAt,
      updatedAt: cfg.createdAt,
    },
  });

  const dono = await db.user.create({
    data: {
      name: cfg.donoNome,
      email: cfg.donoEmail,
      password: senha,
      role: 'OWNER',
      barbershopId: shop.id,
      createdAt: cfg.createdAt,
      workingHours: DEFAULT_HOURS,
    },
  });

  const equipe = [dono];
  for (let i = 0; i < cfg.barbeiros; i++) {
    equipe.push(
      await db.user.create({
        data: {
          name: pick(NOMES),
          email: `barbeiro${i + 1}.${cfg.slug}${DEMO_DOMAIN}`,
          password: senha,
          role: 'BARBER',
          barbershopId: shop.id,
          createdAt: cfg.createdAt,
          workingHours: DEFAULT_HOURS,
        },
      })
    );
  }

  const servicos = [];
  for (const s of SERVICOS.slice(0, cfg.servicos)) {
    servicos.push(await db.service.create({ data: { ...s, barbershopId: shop.id, createdAt: cfg.createdAt } }));
  }

  const produtos = [];
  for (const p of PRODUTOS.slice(0, cfg.produtos)) {
    produtos.push(await db.product.create({ data: { ...p, barbershopId: shop.id, createdAt: cfg.createdAt } }));
  }

  const clientes = [];
  for (let i = 0; i < cfg.clientes; i++) {
    clientes.push(
      await db.client.create({
        data: {
          name: pick(NOMES),
          phone: `11${between(90000, 99999)}${between(1000, 9999)}`,
          barbershopId: shop.id,
          createdAt: daysAgo(between(1, cfg.diasDeAgenda)),
        },
      })
    );
  }

  // Agenda: metade no passado (faturamento) e um pedaço no futuro (a fazer).
  let criados = 0;
  for (let dia = cfg.diasDeAgenda; dia >= -7; dia--) {
    const data = dia >= 0 ? daysAgo(dia) : daysAhead(-dia);
    if (data.getDay() === 0) continue; // domingo fechado

    const quantos = between(0, cfg.picoDiario);
    const horariosDoDia = [...HORARIOS].sort(() => rand() - 0.5).slice(0, quantos);

    for (const hora of horariosDoDia) {
      const cliente = pick(clientes);
      const servico = pick(servicos);
      const vendeProduto = produtos.length > 0 && rand() < 0.25;
      const produto = vendeProduto ? pick(produtos) : null;
      const preco = servico.price + (produto ? produto.price : 0);
      const passado = dia >= 0;

      const appt = await db.appointment.create({
        data: {
          clientName: cliente.name,
          clientId: cliente.id,
          date: dateKey(data),
          time: hora,
          duration: servico.duration,
          status: passado ? (rand() < 0.08 ? 'CANCELED' : 'COMPLETED') : 'CONFIRMED',
          price: preco,
          discount: 0,
          barbershopId: shop.id,
          barberId: pick(equipe).id,
          createdAt: passado ? data : daysAgo(between(0, 5)),
          services: { connect: [{ id: servico.id }] },
          products: produto ? { connect: [{ id: produto.id }] } : undefined,
        },
      });

      // Atendimento concluído no passado tem pagamento registrado.
      if (passado && appt.status === 'COMPLETED') {
        await db.payment.create({
          data: {
            amount: preco,
            appointmentId: appt.id,
            paymentMethodId: pick(formasPagamento).id,
            createdAt: data,
          },
        });
      }
      criados++;
    }
  }

  return { shop, dono, equipe, servicos, produtos, clientes, agendamentos: criados };
}

/**
 * Trava de produção.
 *
 * Este script cria admins SUPERADMIN com senha fixa e conhecida, impressa no
 * terminal. Rodar isso contra o banco de produção é abrir uma porta dos fundos
 * — por isso ele só executa contra banco local, e sair disso exige uma flag
 * explícita que ninguém digita por acidente.
 */
function guardaProducao() {
  const host = (process.env.DB_HOST ?? '').toLowerCase();
  const isLocal = ['localhost', '127.0.0.1', '::1'].includes(host);
  const forcado = process.argv.includes('--eu-sei-o-que-estou-fazendo');

  if (isLocal && process.env.NODE_ENV !== 'production') return;
  if (forcado) {
    console.warn('⚠️  Trava de produção ignorada por flag explícita.\n');
    return;
  }

  console.error('🚫 Bloqueado: o seed de demonstração só roda em banco local.');
  console.error(`   DB_HOST=${host || '(vazio)'}  NODE_ENV=${process.env.NODE_ENV ?? '(vazio)'}`);
  console.error('   Ele cria admins SUPERADMIN com senha conhecida — em produção');
  console.error('   isso seria um acesso administrativo aberto ao seu SaaS.');
  process.exit(1);
}

async function main() {
  guardaProducao();

  const db = prisma();
  const querClean = process.argv.includes('--clean');

  try {
    // Sempre limpa antes de recriar, senão e-mail único estoura na segunda rodada.
    await clean(db);
    if (querClean) {
      console.log('\n✅ Limpeza concluída.');
      return;
    }

    console.log('\nCriando dados de demonstração...\n');

    const formasPagamento = await seedFormasPagamento(db);
    console.log(`  formas de pagamento: ${formasPagamento.length}`);

    // ── Admin do console ────────────────────────────────────────────────
    const adminConsole = await db.platformUser.create({
      data: {
        name: 'Admin Demo',
        email: `admin${DEMO_DOMAIN}`,
        password: await hash(SENHA_CONSOLE, 12),
        role: 'SUPERADMIN',
      },
    });

    const analista = await db.platformUser.create({
      data: {
        name: 'Analista Demo',
        email: `analista${DEMO_DOMAIN}`,
        password: await hash(SENHA_CONSOLE, 12),
        role: 'ANALYST',
      },
    });

    // ── Embaixadores ────────────────────────────────────────────────────
    const carlos = await db.affiliate.create({
      data: {
        code: `${DEMO_CODE_PREFIX}CARLOS`,
        name: 'Carlos Navalha',
        email: `carlos${DEMO_DOMAIN}`,
        phone: '11988887777',
        instagram: '@carlosnavalha',
        pixKey: `carlos${DEMO_DOMAIN}`,
        pixKeyType: 'EMAIL',
        commissionPercent: 50,
        status: 'ACTIVE',
        notes: 'Barbeiro referência em SP, 80k seguidores. Produz Reels semanais.',
        createdAt: daysAgo(160),
      },
    });

    const rafa = await db.affiliate.create({
      data: {
        code: `${DEMO_CODE_PREFIX}RAFA`,
        name: 'Rafa Barber',
        email: `rafa${DEMO_DOMAIN}`,
        phone: '21977776666',
        instagram: '@rafabarberrj',
        pixKey: '21977776666',
        pixKeyType: 'PHONE',
        commissionPercent: 50,
        status: 'ACTIVE',
        createdAt: daysAgo(95),
      },
    });

    const joao = await db.affiliate.create({
      data: {
        code: `${DEMO_CODE_PREFIX}JOAO`,
        name: 'João Tesoura',
        email: `joao${DEMO_DOMAIN}`,
        commissionPercent: 50,
        status: 'PENDING',
        notes: 'Aguardando envio da chave PIX.',
        createdAt: daysAgo(6),
      },
    });

    const pausado = await db.affiliate.create({
      data: {
        code: `${DEMO_CODE_PREFIX}PAUSADO`,
        name: 'Ex-Embaixador',
        email: `pausado${DEMO_DOMAIN}`,
        commissionPercent: 50,
        status: 'PAUSED',
        notes: 'Pausado: parou de produzir conteúdo.',
        createdAt: daysAgo(120),
      },
    });

    console.log(`  embaixadores: 4 (2 ativos, 1 pendente, 1 pausado)`);

    // Cliques espalhados nos últimos 30 dias, com o Carlos convertendo mais.
    let cliques = 0;
    for (const [afiliado, volume] of [[carlos, 140], [rafa, 65], [pausado, 8]]) {
      for (let i = 0; i < volume; i++) {
        const quando = daysAgo(between(0, 29));
        quando.setHours(between(8, 22), between(0, 59));
        await db.referralClick.create({
          data: {
            affiliateId: afiliado.id,
            ipHash: Math.random().toString(16).slice(2, 34),
            userAgent: pick([
              'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15',
              'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36',
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            ]),
            referer: pick(['https://www.instagram.com/', 'https://l.instagram.com/', 'https://www.youtube.com/', null]),
            landingPath: rand() < 0.7 ? '/' : '/registro',
            createdAt: quando,
          },
        });
        cliques++;
      }
    }
    console.log(`  cliques de indicação: ${cliques}`);

    // Cliques que não atribuíram ninguém, para o alerta do dashboard ter o que
    // mostrar. Os códigos são typos plausíveis dos códigos reais — que é
    // exatamente como o problema aparece na vida real.
    const misses = [
      { code: `${DEMO_CODE_PREFIX}CARLOSS`, reason: 'NOT_FOUND', vezes: 23 },
      { code: `${DEMO_CODE_PREFIX}RAFABARBER`, reason: 'NOT_FOUND', vezes: 9 },
      { code: `${DEMO_CODE_PREFIX}JOAO`, reason: 'INACTIVE', vezes: 6 },
    ];

    let perdidos = 0;
    for (const m of misses) {
      for (let i = 0; i < m.vezes; i++) {
        const quando = daysAgo(between(0, 20));
        quando.setHours(between(8, 22), between(0, 59));
        await db.referralMiss.create({
          data: {
            code: m.code,
            reason: m.reason,
            ipHash: Math.random().toString(16).slice(2, 34),
            referer: 'https://www.instagram.com/',
            createdAt: quando,
          },
        });
        perdidos++;
      }
    }
    console.log(`  cliques perdidos (código errado / inativo): ${perdidos}`);

    // ── Funil de aquisição ───────────────────────────────────────────────
    // Cada visitante percorre a linha principal até desistir. As taxas abaixo
    // são plausíveis para tráfego de Instagram, com o gargalo no formulário —
    // que é onde funil de SaaS costuma sangrar de verdade.
    const JORNADA = [
      { step: 'LP_VIEW', segue: 1.0 },
      { step: 'LP_SCROLL_50', segue: 0.55 },
      { step: 'LP_SCROLL_90', segue: 0.45 },
      { step: 'CTA_CLICK', segue: 0.35, key: () => (rand() < 0.6 ? 'hero' : rand() < 0.5 ? 'navbar' : 'free-trial') },
      { step: 'SIGNUP_VIEW', segue: 0.92 },
      { step: 'SIGNUP_START', segue: 0.7 },
      { step: 'SIGNUP_SUBMIT', segue: 0.55 },
      { step: 'SIGNUP_SUCCESS', segue: 0.85 },
      // Depois de criar conta as taxas sobem: quem chegou aqui já se comprometeu.
      { step: 'ACTIVATION_SERVICE_CREATED', segue: 0.85 },
      { step: 'ACTIVATION_APPOINTMENT_CREATED', segue: 0.7 },
      { step: 'CHECKOUT_VIEW', segue: 0.6 },
      { step: 'CHECKOUT_START', segue: 0.7 },
      { step: 'PAID', segue: 0.75 },
    ];

    const CAMPOS = ['userName', 'userEmail', 'barbershopName', 'password'];

    async function jornada(afiliado, origem, device) {
      const quando = daysAgo(between(0, 27));
      quando.setHours(between(8, 22), between(0, 59));

      const visitor = await db.visitor.create({
        data: {
          affiliateId: afiliado ? afiliado.id : null,
          affiliateCode: afiliado ? afiliado.code : null,
          source: origem,
          device,
          // Marca que permite ao --clean achar o visitante orgânico de demo,
          // que não tem embaixador nem barbearia para servir de âncora.
          landingPath: '/?seed=demo',
          firstSeenAt: quando,
          lastSeenAt: quando,
        },
      });

      const eventos = [];
      if (afiliado) eventos.push({ step: 'LINK_CLICK', key: afiliado.code });

      for (const etapa of JORNADA) {
        if (rand() > etapa.segue) break;
        eventos.push({ step: etapa.step, key: etapa.key ? etapa.key() : '' });

        // Quem começou a preencher deixa rastro campo a campo, abandonando
        // progressivamente — a senha é sempre a que menos gente completa.
        if (etapa.step === 'SIGNUP_START') {
          for (const campo of CAMPOS) {
            if (rand() > 0.82) break;
            eventos.push({ step: 'SIGNUP_FIELD', key: campo });
          }
          if (rand() < 0.12) {
            eventos.push({ step: 'SIGNUP_ERROR', key: 'E-mail já cadastrado!' });
          }
        }
      }

      for (const e of eventos) {
        await db.funnelEvent.create({
          data: {
            visitorId: visitor.id,
            step: e.step,
            key: e.key ?? '',
            affiliateId: visitor.affiliateId,
            firstAt: quando,
            lastAt: quando,
          },
        });
      }

      return eventos.length;
    }

    const DEVICES = ['mobile', 'mobile', 'mobile', 'desktop', 'tablet'];
    let visitantes = 0;

    for (const [afiliado, quantos, origem] of [
      [carlos, 240, 'instagram'],
      [rafa, 120, 'youtube'],
      [null, 150, 'direto'],
      [null, 90, 'google'],
    ]) {
      for (let i = 0; i < quantos; i++) {
        await jornada(afiliado, origem, pick(DEVICES));
        visitantes++;
      }
    }
    console.log(`  visitantes no funil: ${visitantes}`);

    // ── Barbearias ──────────────────────────────────────────────────────
    const configs = [
      {
        slug: 'navalha', nome: 'Barbearia Navalha de Ouro', donoNome: 'Marcos Navalha',
        donoEmail: `dono.navalha${DEMO_DOMAIN}`, telefone: '11955554444',
        endereco: 'Rua Augusta, 1200 - São Paulo/SP',
        planStatus: 'PRO', planExpiresAt: daysAhead(22), createdAt: daysAgo(155),
        barbeiros: 3, servicos: 6, produtos: 4, clientes: 40, diasDeAgenda: 60, picoDiario: 7,
        afiliado: carlos, mesesPagos: 5,
      },
      {
        slug: 'cortefino', nome: 'Studio Corte Fino', donoNome: 'Juliana Alves',
        donoEmail: `dono.cortefino${DEMO_DOMAIN}`, telefone: '21966665555',
        endereco: 'Av. Atlântica, 300 - Rio de Janeiro/RJ',
        planStatus: 'PRO', planExpiresAt: daysAhead(11), createdAt: daysAgo(70),
        barbeiros: 2, servicos: 5, produtos: 3, clientes: 25, diasDeAgenda: 45, picoDiario: 5,
        afiliado: rafa, mesesPagos: 2,
      },
      {
        slug: 'barberking', nome: 'BarberKing', donoNome: 'Sérgio Pontes',
        donoEmail: `dono.barberking${DEMO_DOMAIN}`, telefone: '31944443333',
        endereco: 'Rua da Bahia, 88 - Belo Horizonte/MG',
        planStatus: 'TRIAL', planExpiresAt: daysAhead(12), createdAt: daysAgo(33),
        barbeiros: 1, servicos: 4, produtos: 2, clientes: 12, diasDeAgenda: 25, picoDiario: 3,
        afiliado: carlos, mesesPagos: 0,
      },
      {
        slug: 'corteecia', nome: 'Corte & Cia', donoNome: 'Patrícia Gomes',
        donoEmail: `dono.corteecia${DEMO_DOMAIN}`, telefone: '41933332222',
        endereco: 'Rua XV de Novembro, 45 - Curitiba/PR',
        planStatus: 'TRIAL', planExpiresAt: daysAgo(5), createdAt: daysAgo(50),
        barbeiros: 1, servicos: 4, produtos: 2, clientes: 8, diasDeAgenda: 20, picoDiario: 2,
        afiliado: null, mesesPagos: 0,
      },
      {
        slug: 'oldschool', nome: 'Old School Barber', donoNome: 'Ricardo Menezes',
        donoEmail: `dono.oldschool${DEMO_DOMAIN}`, telefone: '51922221111',
        endereco: 'Av. Ipiranga, 900 - Porto Alegre/RS',
        planStatus: 'FREE', planExpiresAt: daysAgo(18), createdAt: daysAgo(120),
        barbeiros: 2, servicos: 5, produtos: 3, clientes: 18, diasDeAgenda: 40, picoDiario: 4,
        afiliado: rafa, mesesPagos: 3, churned: true,
      },
      // Cadastros recentes e orgânicos, só para dar forma ao gráfico de 30 dias.
      ...[3, 8, 14, 19, 26].map((dia, i) => ({
        slug: `nova${i}`, nome: `Barbearia Nova ${i + 1}`, donoNome: pick(NOMES),
        donoEmail: `dono.nova${i}${DEMO_DOMAIN}`, telefone: `1191111${1000 + i}`,
        endereco: 'Endereço de teste',
        planStatus: 'TRIAL', planExpiresAt: daysAhead(45 - dia), createdAt: daysAgo(dia),
        barbeiros: 0, servicos: 3, produtos: 1, clientes: 4, diasDeAgenda: Math.min(dia, 10), picoDiario: 2,
        afiliado: null, mesesPagos: 0,
      })),
    ];

    let totalAgendamentos = 0;
    const criadas = [];

    for (const cfg of configs) {
      const r = await seedBarbearia(db, cfg, formasPagamento);
      totalAgendamentos += r.agendamentos;
      criadas.push({ cfg, shop: r.shop });
      console.log(`  ✓ ${cfg.nome.padEnd(26)} ${cfg.planStatus.padEnd(6)} ${r.agendamentos} agendamentos`);
    }

    // ── Indicações, pagamentos da assinatura e comissões ─────────────────
    let transacoes = 0, comissoes = 0;

    for (const { cfg, shop } of criadas) {
      if (!cfg.afiliado) continue;

      const referral = await db.referral.create({
        data: {
          affiliateId: cfg.afiliado.id,
          barbershopId: shop.id,
          status: cfg.churned ? 'CHURNED' : cfg.mesesPagos > 0 ? 'ACTIVE' : 'TRIAL',
          attributedAt: cfg.createdAt,
          firstPaidAt: cfg.mesesPagos > 0 ? daysAgo(cfg.mesesPagos * 30) : null,
          createdAt: cfg.createdAt,
        },
      });

      // Uma mensalidade por mês pago, da mais antiga para a mais recente.
      for (let m = cfg.mesesPagos; m >= 1; m--) {
        const pagoEm = daysAgo(m * 30);
        const valor = PLANO_CENTAVOS / 100;

        const tx = await db.platformTransaction.create({
          data: {
            externalId: `demo_sub_${shop.id.slice(0, 8)}_${competenceOf(pagoEm)}`,
            barbershopId: shop.id,
            amount: valor,
            kind: 'SUBSCRIPTION',
            status: 'PAID',
            eventType: m === cfg.mesesPagos ? 'subscription.completed' : 'subscription.renewed',
            paidAt: pagoEm,
            createdAt: pagoEm,
          },
        });
        transacoes++;

        // Distribui os estados para o painel de comissões ter o que mostrar:
        // as antigas já pagas, a do meio aprovada, a mais nova pendente.
        const status = m >= 3 ? 'PAID' : m === 2 ? 'APPROVED' : 'PENDING';

        await db.commission.create({
          data: {
            affiliateId: cfg.afiliado.id,
            referralId: referral.id,
            transactionId: tx.id,
            baseAmount: valor,
            percent: cfg.afiliado.commissionPercent,
            amount: Math.round(valor * (cfg.afiliado.commissionPercent / 100) * 100) / 100,
            competence: competenceOf(pagoEm),
            status,
            approvedAt: status !== 'PENDING' ? pagoEm : null,
            paidAt: status === 'PAID' ? daysAgo(m * 30 - 5) : null,
            createdAt: pagoEm,
          },
        });
        comissoes++;
      }
    }

    console.log(`\n  transações de assinatura: ${transacoes}`);
    console.log(`  comissões geradas: ${comissoes}`);

    // Um repasse já fechado, para a tela de comissões não nascer vazia no histórico.
    const pagas = await db.commission.findMany({
      where: { affiliateId: carlos.id, status: 'PAID', payoutId: null },
      select: { id: true, amount: true, createdAt: true },
    });

    if (pagas.length) {
      const total = Math.round(pagas.reduce((s, c) => s + c.amount, 0) * 100) / 100;
      const datas = pagas.map((c) => c.createdAt.getTime());
      const payout = await db.affiliatePayout.create({
        data: {
          affiliateId: carlos.id,
          amount: total,
          periodStart: new Date(Math.min(...datas)),
          periodEnd: new Date(Math.max(...datas)),
          status: 'PAID',
          method: 'PIX',
          reference: 'E2E9F1A0-DEMO-COMPROVANTE',
          paidAt: daysAgo(20),
          createdAt: daysAgo(20),
        },
      });
      await db.commission.updateMany({
        where: { id: { in: pagas.map((c) => c.id) } },
        data: { payoutId: payout.id },
      });
      console.log(`  repasse fechado: R$ ${total.toFixed(2)} para ${carlos.name}`);
    }

    // Auditoria com histórico, senão a tela abre vazia.
    await db.adminAuditLog.createMany({
      data: [
        { platformUserId: adminConsole.id, actorEmail: adminConsole.email, action: 'AFFILIATE_CREATE', targetType: 'Affiliate', targetId: carlos.id, metadata: { code: carlos.code, commissionPercent: 50 }, ip: '192.168.1.10', createdAt: daysAgo(160) },
        { platformUserId: adminConsole.id, actorEmail: adminConsole.email, action: 'AFFILIATE_UPDATE', targetType: 'Affiliate', targetId: carlos.id, metadata: { statusFrom: 'PENDING', statusTo: 'ACTIVE' }, ip: '192.168.1.10', createdAt: daysAgo(159) },
        { platformUserId: adminConsole.id, actorEmail: adminConsole.email, action: 'AFFILIATE_CREATE', targetType: 'Affiliate', targetId: rafa.id, metadata: { code: rafa.code }, ip: '192.168.1.10', createdAt: daysAgo(95) },
        { platformUserId: adminConsole.id, actorEmail: adminConsole.email, action: 'COMMISSION_APPROVE', targetType: 'Commission', metadata: { requested: 3, affected: 3 }, ip: '192.168.1.10', createdAt: daysAgo(25) },
        { platformUserId: adminConsole.id, actorEmail: adminConsole.email, action: 'PAYOUT_CREATE', targetType: 'AffiliatePayout', metadata: { amount: 49.35, affiliateCode: carlos.code }, ip: '192.168.1.10', createdAt: daysAgo(20) },
        { platformUserId: null, actorEmail: `desconhecido${DEMO_DOMAIN}`, action: 'CONSOLE_LOGIN_FAILED', metadata: { attempts: 3 }, ip: '203.0.113.44', createdAt: daysAgo(4) },
        { platformUserId: analista.id, actorEmail: analista.email, action: 'CONSOLE_LOGIN_SUCCESS', ip: '192.168.1.22', createdAt: daysAgo(1) },
      ],
    });

    console.log(`\n${'─'.repeat(64)}`);
    console.log('✅ SEED CONCLUÍDO');
    console.log('─'.repeat(64));
    console.log(`\n📊 CONSOLE DA PLATAFORMA — http://localhost:3000/console/login`);
    console.log(`   ${adminConsole.email}  /  ${SENHA_CONSOLE}   (SUPERADMIN — cria e paga)`);
    console.log(`   ${analista.email}  /  ${SENHA_CONSOLE}   (ANALYST — só lê)`);
    console.log(`\n💈 APP DA BARBEARIA — http://localhost:3000/login`);
    for (const { cfg } of criadas.slice(0, 5)) {
      console.log(`   ${cfg.donoEmail.padEnd(42)} ${cfg.planStatus}`);
    }
    console.log(`   (senha de todas: ${SENHA_BARBEARIA})`);
    console.log(`\n🔗 LINKS DE INDICAÇÃO`);
    console.log(`   http://localhost:3000/r/${carlos.code}   (ativo, converte)`);
    console.log(`   http://localhost:3000/r/${joao.code}     (pendente — não deve gravar cookie)`);
    console.log(`\n   Total: ${criadas.length} barbearias, ${totalAgendamentos} agendamentos, ${cliques} cliques.`);
    console.log(`   Para desfazer: npm run seed:demo -- --clean\n`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => { console.error('❌ Falhou:', e); process.exit(1); });
