import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID to send notification to',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({
    description: 'Title of the notification',
    example: 'Order Status Update',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Message content of the notification',
    example: 'Your order #123 has been shipped successfully.',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  message: string;

  @ApiPropertyOptional({
    description: 'Type of the notification',
    example: 'ORDER',
    enum: NotificationType,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType = NotificationType.ORDER;

  @ApiPropertyOptional({
    description: 'Read status of the notification',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean = false;
}
