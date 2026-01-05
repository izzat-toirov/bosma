import {
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DesignDto {
  @ApiPropertyOptional({
    description: 'X coordinate for design placement',
    example: 100,
    type: Number,
  })
  @IsOptional()
  x?: number;

  @ApiPropertyOptional({
    description: 'Y coordinate for design placement',
    example: 200,
    type: Number,
  })
  @IsOptional()
  y?: number;

  @ApiPropertyOptional({
    description: 'Scale factor for design',
    example: 1.2,
    type: Number,
  })
  @IsOptional()
  scale?: number;

  @ApiPropertyOptional({
    description: 'Rotation angle in degrees',
    example: 45,
    type: Number,
  })
  @IsOptional()
  rotation?: number;

  @ApiPropertyOptional({
    description: 'Text content if design includes text',
    example: 'Hello World',
  })
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({
    description: 'Color for design elements',
    example: '#FF0000',
  })
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({
    description: 'Image URL for design element',
    example: 'https://example.com/design.png',
  })
  @IsOptional()
  imageUrl?: string;
}

export class CreateCartItemDto {
  @ApiProperty({
    description: 'Cart ID to add item to',
    example: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  cartId: number;

  @ApiProperty({
    description: 'Variant ID to add to cart',
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

  @ApiPropertyOptional({
    description: 'Front design coordinates and properties',
    type: DesignDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DesignDto)
  frontDesign?: DesignDto;

  @ApiPropertyOptional({
    description: 'Back design coordinates and properties',
    type: DesignDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DesignDto)
  backDesign?: DesignDto;

  @ApiPropertyOptional({
    description: 'Front design preview URL',
    example: 'https://example.com/preview-front.jpg',
  })
  @IsOptional()
  @IsString()
  frontPreviewUrl?: string;

  @ApiPropertyOptional({
    description: 'Back design preview URL',
    example: 'https://example.com/preview-back.jpg',
  })
  @IsOptional()
  @IsString()
  backPreviewUrl?: string;
}
