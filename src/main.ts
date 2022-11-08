import { PrismaClient } from '@prisma/client';

async function main(): Promise<void> {
  const client = new PrismaClient();
  await client.$connect();
  console.log('[PrismaService] Успешно подключились к базе данных');
}

main();