import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { Markup, Telegraf, } from 'telegraf';
import { ILogger } from '../logger/logger.interface';
import { IUsersService } from '../users/users.service.interface';
import { greetingKeyboards } from './keyboards/greetingsKeyboards';

@injectable()
export class Bot {
  private telegramBot: Telegraf;
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IUsersService) private usersService: IUsersService,
  ) { }

  async loadScenes() {

  }

  async loadGreetings() {
    
    this.telegramBot.on('text', async (ctx) => {
      const username = ctx.message.from.first_name;
      const chatId = ctx.message.chat.id;
      const user = await this.usersService.findOrCreateUser({chatId, username});
      ctx.reply(`Добро пожаловать на биржу ${user.username}`, greetingKeyboards.default);
    })
  }

  async start() {
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) throw new Error('Не задан токен');
    this.telegramBot = new Telegraf(botToken);
    this.loadScenes();
    this.loadGreetings();
    this.telegramBot.launch();
    this.logger.log('[Telegraf] Бот успешно запущен');
  }
}