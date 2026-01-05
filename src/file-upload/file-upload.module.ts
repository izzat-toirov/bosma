import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploadService } from './file-upload.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [ConfigModule, SupabaseModule],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
