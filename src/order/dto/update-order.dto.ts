import { PriceType, Status } from '@prisma/client';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsNumber()
  count?: number;

  @IsNumber()
  price?: number;

  @IsEnum(PriceType)
  priceType?: PriceType;

  @IsString()
  consumer?: string;

  @IsEnum(Status)
  status?: Status;
}
