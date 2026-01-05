import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email address of the user requesting password reset',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "OTP code sent to the user's email",
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    description: 'New password for the user account',
    example: 'NewSecurePassword123!',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
