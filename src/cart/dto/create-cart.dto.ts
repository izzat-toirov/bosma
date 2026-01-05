import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({
    description: 'User ID associated with the cart',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  userId: number;
}
