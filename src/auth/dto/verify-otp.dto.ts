import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumberString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'OTP code sent to the user',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsNumberString()
  @Length(6, 6)
  otpCode: string;
}
