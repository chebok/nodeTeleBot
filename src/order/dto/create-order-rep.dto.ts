import { OrderType, PriceType, Status } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateOrderRepDto {
  @IsEnum(OrderType)
  orderType: OrderType;

  @IsNumber()
  fiatCurrencyId: number;

  @IsNumber()
  cryptoCurrencyId: number;

  @IsNumber()
  count: number;

  @IsNumber()
  price: number;

  @IsEnum(PriceType)
  priceType: PriceType;

  @IsNumber()
  ownerId: number;

  @IsEnum(Status)
  status: Status;
}
