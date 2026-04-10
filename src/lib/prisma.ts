import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/client";

// Tipagem para o objeto global
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT ?? 3306);
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  const adapter = new PrismaMariaDb({
    host: host!,
    port,
    user: user!,
    password: password!,
    database: database!,
    // Aumentamos o limite para evitar o timeout que você recebeu
    connectionLimit: 15,
    // Opcional: tempo de espera para pegar uma conexão do pool (em ms)
    connectTimeout: 10000,
  });

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });
};

// Se já existir no global, usa o existente. Se não, cria um novo.
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

// Em desenvolvimento, salva no global para o Hot Reload não criar novas instâncias
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;