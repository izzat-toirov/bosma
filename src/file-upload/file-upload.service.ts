import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FileUploadService {
  constructor(private supabaseService: SupabaseService) {}

  async uploadFile(
    file: Express.Multer.File,
    allowedMimes: string[] = [],
  ): Promise<string> {
    // Validate file type
    if (allowedMimes.length > 0 && !allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${allowedMimes.join(', ')}`,
      );
    }

    // Upload file to Supabase
    return await this.supabaseService.uploadFile(file, 'uploads');
  }

  /**
   * Uploads an image and returns both original and preview URLs
   */
  async uploadImageWithPreview(
    file: Express.Multer.File,
    allowedMimes: string[] = ['image/jpeg', 'image/png', 'image/jpg'],
  ): Promise<{ originalUrl: string; previewUrl: string }> {
    // Validate file type
    if (allowedMimes.length > 0 && !allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${allowedMimes.join(', ')}`,
      );
    }

    // Since our SupabaseService doesn't have uploadImageWithPreview, we'll implement it here
    const originalUrl = await this.supabaseService.uploadFile(file, 'uploads');

    // For now, just return the original URL for both since we don't have preview functionality
    return {
      originalUrl,
      previewUrl: originalUrl,
    };
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    // Delete file from Supabase
    await this.supabaseService.deleteFile(fileUrl);
    return true; // Return true to indicate successful deletion
  }
}
