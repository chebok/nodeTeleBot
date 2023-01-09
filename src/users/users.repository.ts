import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { UserTelegramDto } from './dto/user.telegram.dto';
import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

  async authorize(userId: number, authStatus: boolean): Promise<User> {
    return this.prismaService.client.user.update({
      where: {
        id: userId,
      },
      data: {
        authorized: authStatus,
      },
    });
  }

  async create({ chatId, username }: UserTelegramDto): Promise<User> {
    return this.prismaService.client.user.create({
      data: {
        chat_id: chatId,
        username,
      },
    });
  }
  async find(chatId: number): Promise<User | null> {
    return this.prismaService.client.user.findFirst({
      where: {
        chat_id: chatId,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.client.user.findMany();
  }

  async findOrCreate({ chatId, username }: UserTelegramDto): Promise<User> {
    const userCandidate = await this.find(chatId);
    if (userCandidate) return userCandidate;
    return this.create({ chatId, username });
  }
}
