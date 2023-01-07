import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { Context, Markup, Scenes, Telegraf } from 'telegraf';
import { ILogger } from '../logger/logger.interface';
import { IUsersService } from '../users/users.service.interface';
import { greetingKeyboards } from './keyboards/greetingsKeyboards';
import LocalSession from 'telegraf-session-local';
import { MakeOrderScene } from './scenes/makeOrderScene';
import { User } from '@prisma/client';
import { IOrderService } from '../order/order.service.interface';
import { UsersScene } from './scenes/usersScene';
import { OrdersScene } from './scenes/ordersScene';

interface MySessionScene extends Scenes.WizardSessionData {
  sceneProp: string;
  data: any;
}

interface MySession extends Scenes.WizardSession<MySessionScene> {
  orderService: IOrderService;
  user: User;
}

export interface MyContext extends Context {
  props: string;
  session: MySession;
  scene: Scenes.SceneContextScene<MyContext, MySessionScene>;
  wizard: Scenes.WizardContextWizard<MyContext>;
}

@injectable()
export class Bot {
  private telegramBot: Telegraf<MyContext>;
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IUsersService) private usersService: IUsersService,
    @inject(TYPES.IOrderService) private orderService: IOrderService,
    @inject(TYPES.MakeOrderScene) private makeOrderScene: MakeOrderScene,
    @inject(TYPES.UsersScene) private usersScene: UsersScene,
    @inject(TYPES.OrdersScene) private ordersScene: OrdersScene,
  ) {}

  async loadScenes(): Promise<void> {
    const stage = new Scenes.Stage<MyContext>([
      this.makeOrderScene.createScene(),
      this.usersScene.createScene(),
      this.ordersScene.createScene(),
    ]);
    this.telegramBot.use(stage.middleware());
    this.telegramBot.hears('Разместить заявку', (ctx) => ctx.scene.enter('makeOrderScene'));
    this.telegramBot.hears('Пользователи', (ctx) => ctx.scene.enter('usersScene'));
    this.telegramBot.hears('Смотреть заявки', (ctx) => ctx.scene.enter('ordersScene'));
  }

  async loadGreetings(): Promise<void> {
    this.telegramBot.on('text', async (ctx) => {
      const username = ctx.message.from.first_name;
      const chatId = ctx.message.chat.id;
      const user = await this.usersService.findOrCreateUser({ chatId, username });
      ctx.session.user = user;
      console.log(ctx.session);
      ctx.reply(`Добро пожаловать на биржу ${user.username}`, greetingKeyboards.admin);
    });
  }

  async start(): Promise<void> {
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) throw new Error('Не задан токен');
    this.telegramBot = new Telegraf<MyContext>(botToken);
    this.telegramBot.use(new LocalSession().middleware());
    this.loadScenes();
    this.telegramBot.use((ctx, next) => {
      ctx.session.user;
      ctx.scene.session.data;
      next();
    });
    this.loadGreetings();
    this.telegramBot.launch();
    this.logger.log('[Telegraf] Бот успешно запущен');
  }
}
