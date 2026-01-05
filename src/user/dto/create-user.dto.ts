import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  Matches,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

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
    description: 'Phone number of the user',
    example: '+998901234567',
  })
  @IsPhoneNumber('UZ')
  phone: string;

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

  @ApiProperty({
    description: 'Role of the user',
    example: 'USER',
    enum: Role,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.USER;

  @ApiProperty({
    description: 'Hashed refresh token for the user',
    example: 'hashed_token_value',
    required: false,
  })
  @IsOptional()
  hashedRefreshToken?: string | null;

  // create-user.dto.ts

  @ApiProperty({
    description: 'Whether the user is active',
    example: false,
    required: false, // Swagger uchun
  })
  @IsOptional() // class-validator uchun
  @IsBoolean()
  isActive?: boolean; // "?" belgisi bu maydonni optional (ixtiyoriy) qiladi
}
