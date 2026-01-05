import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderModule } from '../order/order.module';
import { AuthModule } from '../auth/auth.module';
import { SecurityModule } from '../common/security/security.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => OrderModule),
    ConfigModule,
    AuthModule,
    SecurityModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
