import { Currency } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';

@injectable()
export class CurrencyRepository {
  constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

  async create(title: string): Promise<Currency> {
    return this.prismaService.client.currency.create({
      data: {
        title,
      },
    });
  }
  async findByTitle(title: string): Promise<Currency | null> {
    return this.prismaService.client.currency.findFirst({
      where: {
        title,
      },
    });
  }
  async findById(id: number): Promise<Currency | null> {
    return this.prismaService.client.currency.findFirst({
      where: {
        id,
      },
    });
  }

  async findAll(): Promise<Currency[]> {
    return this.prismaService.client.currency.findMany();
  }
}
