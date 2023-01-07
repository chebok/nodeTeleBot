import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const currencies = ['USDT', 'BTC', 'ETH', 'USD', 'EUR', 'RUB'];

async function main() {
  await prisma.$connect();
  await prisma.currency.createMany({
    data: currencies.map((cur) => {
      return { title: cur };
    }),
  });
  await prisma.$disconnect();
}

main();
