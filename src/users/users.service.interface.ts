import { User } from '@prisma/client';
import { UserTelegramDto } from './dto/user.telegram.dto';

export interface IUsersService {
  findOrCreateUser(dto: UserTelegramDto): Promise<User>;
  authorizeUser(userId: number, authStatus: boolean): Promise<User>;
  findAll(): Promise<User[]>;
}
