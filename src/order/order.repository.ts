import { Order } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { CreateOrderRepDto } from './dto/create-order-rep.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IOrderRepository } from './order.repository.interface';

@injectable()
export class OrderRepository implements IOrderRepository {
  constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

  findMany(): Promise<Order[]> {
    return this.prismaService.client.order.findMany();
  }

  create(dto: CreateOrderRepDto): Promise<Order> {
    return this.prismaService.client.order.create({
      data: dto,
    });
  }

  find(orderId: number): Promise<Order | null> {
    return this.prismaService.client.order.findFirst({
      where: {
        id: orderId,
      },
    });
  }

  update(orderId: number, data: UpdateOrderDto): Promise<Order> {
    return this.prismaService.client.order.update({
      where: {
        id: orderId,
      },
      data,
    });
  }
}
