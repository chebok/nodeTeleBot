import { IsEnum, IsNumber, isValidationOptions } from 'class-validator';
import { OrderType, PriceType } from '@prisma/client';
import { ValidCurrency } from '../order.enum';

export class CreateOrderDto {
  @IsEnum(OrderType)
  orderType: OrderType;

  @IsEnum(ValidCurrency)
  fiatCurrency: ValidCurrency;

  @IsEnum(ValidCurrency)
  cryptoCurrency: ValidCurrency;

  @IsNumber({ allowNaN: false })
  count: number;

  @IsNumber({ allowNaN: false })
  price: number;

  @IsEnum(PriceType)
  priceType: PriceType;

  @IsNumber()
  chatId: number;
}
