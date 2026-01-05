import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min, IsUrl } from 'class-validator';

export class UpdateAssetDto {
  @ApiPropertyOptional({
    description: 'Updated URL of the asset',
    example: 'https://example.com/uploads/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({
    description: 'Updated user ID that owns this asset',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;
}
