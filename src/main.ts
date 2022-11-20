import { PrismaClient } from '@prisma/client';

class App {
  async init() {
    const client = new PrismaClient();
    await client.$connect();
    console.log('[PrismaService] Успешно подключились к базе данных');
    await client.order.create({data: {
      orderType: ''
    }})
  }
}


const app = new App();
app.init();