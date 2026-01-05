import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient | null;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        '⚠️ Supabase configuration is missing. File upload functionality will not work properly.',
      );
      console.warn(
        'Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables.',
      );
      this.supabase = null;
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    subfolder?: string,
  ) {
    if (!this.supabase) {
      throw new BadRequestException(
        'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.',
      );
    }

    // Check if file buffer exists and has content
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('File buffer is empty or invalid');
    }

    // Sanitize file name: replace non-ASCII characters, spaces, and special symbols with dashes
    const sanitizedFileName = this.sanitizeFileName(file.originalname);
    const timestamp = Date.now();
    const filePath = subfolder
      ? `${folder}/${subfolder}/${timestamp}-${sanitizedFileName}`
      : `${folder}/${timestamp}-${sanitizedFileName}`;

    const { data, error } = await this.supabase.storage
      .from('bosma-images') // Your bucket name
      .upload(filePath, file.buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.mimetype || 'application/octet-stream',
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }

    // Get the public URL
    const { data: publicData } = this.supabase.storage
      .from('bosma-images')
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  }

  private sanitizeFileName(fileName: string): string {
    // Remove non-ASCII characters and replace with safe alternatives (dashes)
    return fileName
      .normalize('NFD') // Normalize Unicode characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-zA-Z0-9.-]/g, '-') // Replace non-alphanumeric characters with dashes
      .replace(/-{2,}/g, '-') // Replace multiple dashes with single dash
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  }

  async deleteFile(fileUrl: string) {
    if (!this.supabase) {
      throw new BadRequestException(
        'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.',
      );
    }

    // Extract file path from URL
    const pathStart = fileUrl.indexOf('/object/public/bosma-images/') + 25;
    const filePath = fileUrl.substring(pathStart);

    const { error } = await this.supabase.storage
      .from('bosma-images')
      .remove([filePath]);

    if (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }
}
