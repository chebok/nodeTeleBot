import { Order } from '@prisma/client';
import { CreateOrderRepDto } from './dto/create-order-rep.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

export interface IOrderRepository {
  create(data: CreateOrderRepDto): Promise<Order>;
  find(orderId: number): Promise<Order | null>;
  update(orderId: number, data: UpdateOrderDto): Promise<Order>;
  findMany(): Promise<Order[]>;
}
