import {
  IsArray,
  IsString,
  IsUUID,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderRequestDto {
  @IsUUID()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemRequestDto)
  items: OrderItemRequestDto[];

  @IsString()
  correlationId: string;
}

export class OrderItemRequestDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}
