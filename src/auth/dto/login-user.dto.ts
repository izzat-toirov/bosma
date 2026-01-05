import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class LoginUserDto {
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
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;
}
