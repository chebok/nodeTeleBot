import { IsEnum, IsNumber, isValidationOptions } from 'class-validator';
import { OrderType, PriceType } from '@prisma/client';
import { ValidCurrency } from '../order.enum';

export class CreateOrderDto {
  @IsEnum(OrderType)
  orderType: OrderType;

  @IsEnum(ValidCurrency, { message: 'Такой фиатной валюты нет' })
  fiatCurrency: ValidCurrency;

  @IsEnum(ValidCurrency, { message: 'Такой криптовалюты нет' })
  cryptoCurrency: ValidCurrency;

  @IsNumber({ allowNaN: false }, { message: 'Количество должно быть числом' })
  count: number;

  @IsNumber({ allowNaN: false }, { message: 'Прайс должен быть числом' })
  price: number;

  @IsEnum(PriceType)
  priceType: PriceType;

  @IsNumber()
  chatId: number;
}
