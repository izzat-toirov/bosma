import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsUrl } from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({
    description: 'URL of the uploaded asset',
    example: 'https://example.com/uploads/image.jpg',
  })
  @IsString()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'User ID that owns this asset',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  userId: number;
}
