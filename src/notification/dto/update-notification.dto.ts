import { ApiPropertyOptional } from '@nestjs/swagger';
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

export class UpdateNotificationDto {
  @ApiPropertyOptional({
    description: 'Updated user ID to send notification to',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiPropertyOptional({
    description: 'Updated title of the notification',
    example: 'Order Status Update',
    minLength: 1,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated message content of the notification',
    example: 'Your order #123 has been shipped successfully.',
    minLength: 1,
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;

  @ApiPropertyOptional({
    description: 'Updated type of the notification',
    example: 'ORDER',
    enum: NotificationType,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({
    description: 'Updated read status of the notification',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
