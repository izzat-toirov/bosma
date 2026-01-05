import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'New quantity for the cart item',
    example: 2,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
