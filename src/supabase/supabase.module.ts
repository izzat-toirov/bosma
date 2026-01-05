import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [SupabaseService, ConfigService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
