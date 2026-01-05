import {
  IsInt,
  IsNumber,
  Min,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderItemRequestDto {
  @ApiProperty({
    description: 'Order ID that this item belongs to',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  orderId: number;

  @ApiProperty({
    description: 'Variant ID of the product in this order item',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  variantId: number;

  @ApiProperty({
    description: 'Quantity of this item in the order',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Price of this item',
    example: 29.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Front design data for customization',
    example: {
      x: 100,
      y: 200,
      scale: 1.2,
      rotation: 45,
      imageUrl: 'https://example.com/design.png',
    },
    required: false,
  })
  @IsOptional()
  frontDesign?: any;

  @ApiPropertyOptional({
    description: 'URL of the front design preview',
    example: 'https://example.com/preview-front.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(500)
  frontPreviewUrl?: string;

  @ApiPropertyOptional({
    description: 'Back design data for customization',
    example: {
      x: 150,
      y: 250,
      scale: 1.0,
      rotation: 0,
      imageUrl: 'https://example.com/back-design.png',
    },
    required: false,
  })
  @IsOptional()
  backDesign?: any;

  @ApiPropertyOptional({
    description: 'URL of the back design preview',
    example: 'https://example.com/preview-back.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(500)
  backPreviewUrl?: string;

  @ApiPropertyOptional({
    description: 'URL of the final print file',
    example: 'https://example.com/final-print.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(500)
  finalPrintFile?: string;
}
