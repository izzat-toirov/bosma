import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  Matches,
} from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterAuthDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+998901234567',
  })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({
    description: 'Password for the account',
    example: 'SecurePassword123!',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string; // Make email required

  @ApiProperty({
    description: 'Region of the user',
    example: 'Tashkent',
    required: false,
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({
    description: 'Address of the user',
    example: 'Tashkent, Yunusabad district, 1st quarter, house 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  // @ApiProperty({
  //   description: 'Role of the user',
  //   example: 'USER',
  //   enum: Role,
  //   required: false,
  // })
  // @IsOptional()
  // @IsEnum(Role)
  // role?: Role = Role.USER;
}
