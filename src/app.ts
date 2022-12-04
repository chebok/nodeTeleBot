import * as dotenv from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import { Bot } from './bot/bot.service';
import { ILogger } from './logger/logger.interface';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
  constructor(
    @inject(TYPES.Bot) private bot: Bot,
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.PrismaService) private prismaService: PrismaService,
  ) { }


  public async init() {
    dotenv.config();
    await this.prismaService.connect();
    
    this.bot.start();
  }
}