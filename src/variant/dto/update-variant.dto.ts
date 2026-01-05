import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Size } from '@prisma/client';

export class UpdateVariantDto {
  @ApiPropertyOptional({
    description: 'Updated ID of the product this variant belongs to',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  productId?: number;

  @ApiPropertyOptional({
    description: 'Updated color of the variant',
    example: 'Red',
    minLength: 1,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({
    description: 'Updated size of the variant',
    example: 'M',
    enum: Size,
    required: false,
  })
  @IsOptional()
  @IsEnum(Size)
  size?: Size;

  @ApiPropertyOptional({
    description: 'Updated stock quantity of this variant',
    example: 100,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: 'Updated price of the variant',
    example: 29.99,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Updated URL of the front image',
    example: 'https://example.com/images/variant-front.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  frontImage?: string;

  @ApiPropertyOptional({
    description: 'Updated URL of the back image',
    example: 'https://example.com/images/variant-back.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  backImage?: string;

  @ApiPropertyOptional({
    description: 'Updated top position of the print area',
    example: 50,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  printAreaTop?: number;

  @ApiPropertyOptional({
    description: 'Updated left position of the print area',
    example: 50,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  printAreaLeft?: number;

  @ApiPropertyOptional({
    description: 'Updated width of the print area',
    example: 200,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  printAreaWidth?: number;

  @ApiPropertyOptional({
    description: 'Updated height of the print area',
    example: 200,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  printAreaHeight?: number;
}
