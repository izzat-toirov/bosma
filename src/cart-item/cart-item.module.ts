import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CartModule } from '../cart/cart.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, CartModule, ConfigModule, AuthModule],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
