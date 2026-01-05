import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    description: 'Email address to send OTP to',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;
}
