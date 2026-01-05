import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    description: 'Product variant ID to add to cart',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  variantId: number;

  @ApiProperty({
    description: 'Quantity of the product to add',
    example: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Front design data (JSON)',
    required: false,
    example: { designId: '123', text: 'Custom text' },
  })
  @IsOptional()
  frontDesign?: any;

  @ApiProperty({
    description: 'Back design data (JSON)',
    required: false,
    example: { designId: '124', text: 'Back text' },
  })
  @IsOptional()
  backDesign?: any;

  @ApiProperty({
    description: 'Front preview URL',
    required: false,
    example: 'https://example.com/preview-front.png',
  })
  @IsOptional()
  frontPreviewUrl?: string;

  @ApiProperty({
    description: 'Back preview URL',
    required: false,
    example: 'https://example.com/preview-back.png',
  })
  @IsOptional()
  backPreviewUrl?: string;
}
