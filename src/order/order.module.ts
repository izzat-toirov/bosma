import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VariantModule } from '../variant/variant.module';
import { NotificationModule } from '../notification/notification.module';
import { CartModule } from '../cart/cart.module';
import { AuthModule } from '../auth/auth.module';
import { SecurityModule } from '../common/security/security.module';

@Module({
  imports: [
    PrismaModule,
    VariantModule,
    NotificationModule,
    forwardRef(() => CartModule),
    ConfigModule,
    AuthModule,
    SecurityModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
