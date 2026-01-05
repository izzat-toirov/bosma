import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';
import { SecurityModule } from '../common/security/security.module';

@Module({
  imports: [
    PrismaModule,
    FileUploadModule,
    ConfigModule,
    SupabaseModule,
    AuthModule,
    SecurityModule,
  ],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
