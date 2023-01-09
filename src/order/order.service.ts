import { Currency, Order, User } from '@prisma/client';
import { validate, ValidationError } from 'class-validator';
import { inject, injectable } from 'inversify';
import { CurrencyRepository } from '../currency/currency.repository';
import { TYPES } from '../types';
import { IUsersRepository } from '../users/users.repository.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { PriceType, Status } from './order.enum';
import { IOrderRepository } from './order.repository.interface';
import { IOrderService } from './order.service.interface';
import 'reflect-metadata';

@injectable()
export class OrderService implements IOrderService {
  constructor(
    @inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository,
    @inject(TYPES.IOrderRepository) private orderRepository: IOrderRepository,
    @inject(TYPES.CurrencyRepository) private currencyRepository: CurrencyRepository,
  ) {}

  async findMany(): Promise<Order[]> {
    return await this.orderRepository.findMany();
  }

  async createOrder(dto: CreateOrderDto): Promise<Order | ValidationError[]> {
    const { orderType, fiatCurrency, cryptoCurrency, count, price, priceType, chatId } = dto;
    const validateTarget = new CreateOrderDto();
    Object.assign(validateTarget, dto);
    const errors = await validate(validateTarget);
    if (errors.length > 0) {
      return errors;
    }
    const user = (await this.usersRepository.find(chatId)) as User;
    const { id: ownerId } = user;
    const { id: fiatCurrencyId } = (await this.currencyRepository.findByTitle(
      fiatCurrency,
    )) as Currency;
    const { id: cryptoCurrencyId } = (await this.currencyRepository.findByTitle(
      cryptoCurrency,
    )) as Currency;
    const order = await this.orderRepository.create({
      orderType,
      fiatCurrencyId,
      cryptoCurrencyId,
      count,
      price,
      priceType,
      ownerId,
      status: Status.OPEN,
    });
    return order;
  }

  async changeCount(orderId: number, newCount: number): Promise<Order> {
    return await this.orderRepository.update(orderId, { count: newCount });
  }

  async changePrice(orderId: number, newPrice: number, priceType: PriceType): Promise<Order> {
    return await this.orderRepository.update(orderId, { price: newPrice, priceType });
  }

  async closeOrder(orderId: number): Promise<Order> {
    return await this.orderRepository.update(orderId, { status: Status.CLOSE });
  }

  async consumeOrder(orderId: number, consumer?: string | undefined): Promise<Order> {
    const consumerInfo = consumer ? consumer : 'Не указан';
    return await this.orderRepository.update(orderId, {
      consumer: consumerInfo,
      status: Status.EXECUTED,
    });
  }

  async partialConsumeOrder(
    orderId: number,
    count: number,
    consumer?: string | undefined,
  ): Promise<Order> {
    const oldOrder = await this.orderRepository.find(orderId);
    if (!oldOrder) throw new Error('Такого ордера не существует');
    const freeCount = oldOrder.count - count;
    if (freeCount <= 0) {
      throw new Error('Запрашиваемое количество превышает допустимое в заявке');
    }
    const consumerInfo = consumer ? consumer : 'Не указан';
    const { orderType, fiatCurrencyId, cryptoCurrencyId, price, priceType, ownerId, status } = {
      ...oldOrder,
    };
    await this.orderRepository.update(orderId, {
      count,
      consumer: consumerInfo,
      status: Status.EXECUTED,
    });

    const newOrder = await this.orderRepository.create({
      orderType,
      fiatCurrencyId,
      cryptoCurrencyId,
      price,
      priceType,
      ownerId,
      status,
      count: freeCount,
    });
    return newOrder;
  }
}
