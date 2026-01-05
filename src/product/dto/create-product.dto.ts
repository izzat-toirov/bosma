import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Category } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Premium Hoodie',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the product',
    example: 'Comfortable and stylish hoodie made from premium materials',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Category of the product',
    example: 'HOODIE',
    enum: Category,
  })
  @IsEnum(Category)
  category: Category;
}
