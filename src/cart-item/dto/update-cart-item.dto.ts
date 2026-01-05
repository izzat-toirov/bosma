import {
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DesignDto } from './create-cart-item.dto';

export class UpdateCartRequestDto {
  @ApiPropertyOptional({
    description: 'Cart ID to update item in',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  cartId?: number;

  @ApiPropertyOptional({
    description: 'Variant ID to update',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  variantId?: number;

  @ApiPropertyOptional({
    description: 'Quantity of the item',
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

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
