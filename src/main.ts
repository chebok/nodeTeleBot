import { App } from './app';
import { TYPES } from './types';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { PrismaService } from './database/prisma.service';
import { Bot } from './bot/bot.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UsersRepository } from './users/users.repository';
import { IUsersService } from './users/users.service.interface';
import { UsersService } from './users/users.service';
import { CurrencyRepository } from './currency/currency.repository';
import { IOrderService } from './order/order.service.interface';
import { OrderService } from './order/order.service';
import { OrderRepository } from './order/order.repository';
import { IOrderRepository } from './order/order.repository.interface';
import { MakeOrderScene } from './bot/scenes/makeOrderScene';
import { UsersScene } from './bot/scenes/usersScene';
import { CurrencyService } from './currency/currency.service';
import { OrdersScene } from './bot/scenes/ordersScene';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository);
  bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository);
  bind<CurrencyRepository>(TYPES.CurrencyRepository).to(CurrencyRepository);
  bind<CurrencyService>(TYPES.CurrencyService).to(CurrencyService);
  bind<IUsersService>(TYPES.IUsersService).to(UsersService);
  bind<IOrderService>(TYPES.IOrderService).to(OrderService);
  bind<App>(TYPES.Application).to(App).inSingletonScope();
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService);
  bind<MakeOrderScene>(TYPES.MakeOrderScene).to(MakeOrderScene);
  bind<UsersScene>(TYPES.UsersScene).to(UsersScene);
  bind<OrdersScene>(TYPES.OrdersScene).to(OrdersScene);
});

function bootstrap(): { app: App; appContainer: Container } {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  app.init();
  return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
