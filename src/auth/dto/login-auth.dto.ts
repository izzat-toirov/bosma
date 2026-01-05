import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'admin@bosma.uz',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the account',
    example: 'Admin123!',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
