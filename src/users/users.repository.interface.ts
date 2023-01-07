import { User } from '@prisma/client';
import { UserTelegramDto } from './dto/user.telegram.dto';

export interface IUsersRepository {
  create(user: UserTelegramDto): Promise<User>;
  find(chatId: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  findOrCreate(user: UserTelegramDto): Promise<User>;
  authorize(userId: number, authStatus: boolean): Promise<User>;
}
