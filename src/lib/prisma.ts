import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/client";

// Tipagem para o objeto global
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1"];

const prismaClientSingleton = () => {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT ?? 3306);
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  const isLocal = LOCAL_HOSTS.includes((host ?? "").toLowerCase());
  const useSsl = process.env.DB_SSL === "true";

  /**
   * O MySQL 8 autentica com `caching_sha2_password`. Numa conexão sem TLS, o
   * cliente precisa buscar a chave pública RSA do servidor para completar o
   * login — e sem essa permissão TODA conexão nova falha na autenticação.
   *
   * O sintoma engana: o Prisma reporta "pool timeout ... active=0 idle=0",
   * que parece pool esgotado, quando na verdade nenhuma conexão conseguiu
   * autenticar. O erro é intermitente porque o servidor mantém um cache de
   * credenciais — enquanto ele está quente tudo funciona, e volta a quebrar
   * depois de um restart do MySQL ou de um FLUSH PRIVILEGES.
   *
   * Buscar a chave pública em rede aberta é janela para man-in-the-middle
   * (um atacante entrega a própria chave e captura a senha), então só é
   * liberado em localhost. Fora dele, o caminho correto é TLS: defina
   * DB_SSL=true.
   */
  const adapter = new PrismaMariaDb({
    host: host!,
    port,
    user: user!,
    password: password!,
    database: database!,
    allowPublicKeyRetrieval: isLocal,
    ...(useSsl ? { ssl: { rejectUnauthorized: true } } : {}),
    // Aumentamos o limite para evitar o timeout que você recebeu
    connectionLimit: 15,
    // Opcional: tempo de espera para pegar uma conexão do pool (em ms)
    connectTimeout: 10000,
  });

  if (!isLocal && !useSsl) {
    console.warn(
      "⚠️ Banco remoto sem TLS. Se o usuário do MySQL usa caching_sha2_password, " +
      "as conexões vão falhar com 'pool timeout'. Defina DB_SSL=true."
    );
  }

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