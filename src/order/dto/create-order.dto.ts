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

export class CreateOrderItemRequestDto {
  @ApiProperty({
    description: 'ID of the product variant',
    example: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  variantId: number;

  @ApiProperty({
    description: 'Quantity of the item',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Price of the item',
    example: 49.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Front design coordinates and properties',
    example: {
      x: 100,
      y: 200,
      scale: 1.2,
      rotation: 45,
      imageUrl: 'https://example.com/design.png',
    },
    type: Object,
  })
  @IsOptional()
  frontDesign?: any;

  @ApiPropertyOptional({
    description: 'Front design preview URL',
    example: 'https://example.com/preview-front.jpg',
  })
  @IsOptional()
  @IsString()
  frontPreviewUrl?: string;

  @ApiPropertyOptional({
    description: 'Back design coordinates and properties',
    example: {
      x: 150,
      y: 250,
      scale: 1.0,
      rotation: 0,
      imageUrl: 'https://example.com/back-design.png',
    },
    type: Object,
  })
  @IsOptional()
  backDesign?: any;

  @ApiPropertyOptional({
    description: 'Back design preview URL',
    example: 'https://example.com/preview-back.jpg',
  })
  @IsOptional()
  @IsString()
  backPreviewUrl?: string;

  @ApiPropertyOptional({
    description: 'Final print file URL',
    example: 'https://example.com/final-print.jpg',
  })
  @IsOptional()
  @IsString()
  finalPrintFile?: string;
}

export class CreateOrderDto {
  @ApiPropertyOptional({
    description: 'User ID (will be auto-assigned if not provided)',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  @IsString()
  customerName: string;

  @ApiProperty({
    description: 'Customer phone number in Uzbekistan format',
    example: '+998901234567',
  })
  @IsPhoneNumber('UZ')
  customerPhone: string;

  @ApiProperty({
    description: 'Region for delivery',
    example: 'Tashkent',
  })
  @IsString()
  region: string;

  @ApiProperty({
    description: 'Full delivery address',
    example: "Tashkent, Navoiy ko'chasi, 5-uy",
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Total price of the order',
    example: 99.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiPropertyOptional({
    description: 'Order status',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus = OrderStatus.PENDING;

  @ApiPropertyOptional({
    description: 'Payment status',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus = PaymentStatus.UNPAID;

  @ApiProperty({
    description: 'Array of order items with design information',
    type: [CreateOrderItemRequestDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemRequestDto)
  items: CreateOrderItemRequestDto[];
}
