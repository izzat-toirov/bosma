import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateVariantDto {
  @ApiProperty({
    description: 'ID of the product this variant belongs to',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({
    description: 'Color of the variant',
    example: 'Red',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  color: string;

  @ApiProperty({
    description: 'Size of the variant',
    example: 'M',
    enum: Size,
  })
  @IsEnum(Size)
  size: Size;

  @ApiProperty({
    description: 'Stock quantity of this variant',
    example: 100,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Price of the variant',
    example: 29.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'URL of the front image',
    example: 'https://example.com/images/variant-front.jpg',
  })
  @IsString()
  @IsUrl()
  frontImage: string;

  @ApiProperty({
    description: 'URL of the back image',
    example: 'https://example.com/images/variant-back.jpg',
  })
  @IsString()
  @IsUrl()
  backImage: string;

  @ApiProperty({
    description: 'Top position of the print area',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  printAreaTop: number;

  @ApiProperty({
    description: 'Left position of the print area',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  printAreaLeft: number;

  @ApiProperty({
    description: 'Width of the print area',
    example: 200,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  printAreaWidth: number;

  @ApiProperty({
    description: 'Height of the print area',
    example: 200,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  printAreaHeight: number;
}
