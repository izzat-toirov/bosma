import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsBoolean,
  MinLength,
  Matches,
} from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Updated full name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Updated email address of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Updated password for the account',
    example: 'SecurePassword123!',
    minLength: 6,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Updated phone number of the user',
    example: '+998901234567',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiPropertyOptional({
    description: 'Updated region of the user',
    example: 'Tashkent',
    required: false,
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({
    description: 'Updated address of the user',
    example: 'Tashkent, Yunusabad district, 1st quarter, house 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Updated role of the user',
    example: 'USER',
    enum: Role,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    description: 'Updated active status of the user',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Hashed refresh token for the user',
    example: 'hashed_token_value',
    required: false,
  })
  @IsOptional()
  @IsString()
  hashedRefreshToken?: string | null;

  @ApiPropertyOptional({
    description: 'OTP code for user verification',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  otpCode?: string | null;

  @ApiPropertyOptional({
    description: 'Expiration time for the OTP code',
    example: '2023-01-01T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  otpExpires?: Date | null;
}
