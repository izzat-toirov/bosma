import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Category } from '@prisma/client';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Updated name of the product',
    example: 'Premium Hoodie',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated description of the product',
    example: 'Comfortable and stylish hoodie made from premium materials',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated category of the product',
    example: 'HOODIE',
    enum: Category,
    required: false,
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;
}
