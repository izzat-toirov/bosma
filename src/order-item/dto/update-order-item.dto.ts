import {
  IsInt,
  IsNumber,
  Min,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderItemDto {
  @ApiPropertyOptional({
    description: 'Updated order ID that this item belongs to',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  orderId?: number;

  @ApiPropertyOptional({
    description: 'Updated variant ID of the product in this order item',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  variantId?: number;

  @ApiPropertyOptional({
    description: 'Updated quantity of this item in the order',
    example: 2,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Updated price of this item',
    example: 29.99,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Updated front design data for customization',
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
    description: 'Updated URL of the front design preview',
    example: 'https://example.com/preview-front.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(500)
  frontPreviewUrl?: string;

  @ApiPropertyOptional({
    description: 'Updated back design data for customization',
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
    description: 'Updated URL of the back design preview',
    example: 'https://example.com/preview-back.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(500)
  backPreviewUrl?: string;

  @ApiPropertyOptional({
    description: 'Updated URL of the final print file',
    example: 'https://example.com/final-print.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(500)
  finalPrintFile?: string;
}
