import {
  IsInt,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  IsOptional,
  ValidateNested,
  IsPhoneNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { CreateOrderItemRequestDto } from './create-order.dto';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'User ID',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiPropertyOptional({
    description: 'Customer name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: 'Customer phone number in Uzbekistan format',
    example: '+998901234567',
  })
  @IsOptional()
  @IsPhoneNumber('UZ')
  customerPhone?: string;

  @ApiPropertyOptional({
    description: 'Region for delivery',
    example: 'Tashkent',
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({
    description: 'Full delivery address',
    example: "Tashkent, Navoiy ko'chasi, 5-uy",
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Total price of the order',
    example: 99.99,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;

  @ApiPropertyOptional({
    description: 'Order status',
    enum: OrderStatus,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Payment status',
    enum: PaymentStatus,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Array of order items with design information',
    type: [CreateOrderItemRequestDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemRequestDto)
  items?: CreateOrderItemRequestDto[];
}
