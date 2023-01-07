import { inject, injectable } from 'inversify';
import { User } from '@prisma/client';
import { TYPES } from '../types';
import { UserTelegramDto } from './dto/user.telegram.dto';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
  constructor(@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository) {}
  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  async findOrCreateUser(dto: UserTelegramDto): Promise<User> {
    return await this.usersRepository.findOrCreate(dto);
  }
  async authorizeUser(userId: number, authStatus: boolean): Promise<User> {
    return this.usersRepository.authorize(userId, authStatus);
  }
}
