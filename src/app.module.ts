import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { AssetModule } from './asset/asset.module';
import { OrderItemModule } from './order-item/order-item.module';
import { VariantModule } from './variant/variant.module';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { PrintFileModule } from './print-file/print-file.module';
import { NotificationModule } from './notification/notification.module';
import { SupabaseModule } from './supabase/supabase.module';
import { SecurityModule } from './common/security/security.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Time to live in milliseconds
        limit: 10, // Maximum number of requests within the TTL
      },
    ]),
    PrismaModule,
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
    AssetModule,
    OrderItemModule,
    VariantModule,
    CartModule,
    CartItemModule,
    FileUploadModule,
    PrintFileModule,
    NotificationModule,
    SupabaseModule,
    SecurityModule,
  ],
})
export class AppModule {}
