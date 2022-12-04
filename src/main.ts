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

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository).inSingletonScope();
  bind<IUsersService>(TYPES.IUsersService).to(UsersService).inSingletonScope();
  bind<App>(TYPES.Application).to(App).inSingletonScope();
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
});

function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application)
  app.init();
  return { app, appContainer };
};

export const { app, appContainer } = bootstrap();