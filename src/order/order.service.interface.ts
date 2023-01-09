import { Order } from '@prisma/client';
import { ValidationError } from 'class-validator';
import { CreateOrderDto } from './dto/create-order.dto';
import { PriceType } from './order.enum';

export interface IOrderService {
  createOrder(dto: CreateOrderDto): Promise<Order | ValidationError[]>;
  changeCount(orderId: number, newCount: number): Promise<Order>;
  changePrice(orderId: number, newPrice: number, priceType: PriceType): Promise<Order>;
  closeOrder(orderId: number): Promise<Order>;
  consumeOrder(orderId: number, consumer?: string): Promise<Order>;
  partialConsumeOrder(orderId: number, count: number, consumer?: string): Promise<Order>;
  findMany(): Promise<Order[]>;
}
