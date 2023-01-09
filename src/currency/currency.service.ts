import { Currency } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { CurrencyRepository } from './currency.repository';

@injectable()
export class CurrencyService {
  constructor(@inject(TYPES.CurrencyRepository) private currencyRepository: CurrencyRepository) {}

  async create(title: string): Promise<Currency> {
    return this.currencyRepository.create(title);
  }
  async findByTitle(title: string): Promise<Currency | null> {
    return this.currencyRepository.findByTitle(title);
  }

  async findAll(): Promise<Currency[]> {
    return this.currencyRepository.findAll();
  }

  async findById(id: number): Promise<Currency | null> {
    return this.currencyRepository.findById(id);
  }
}
