import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderModule } from '../order/order.module';
import { VariantModule } from '../variant/variant.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, OrderModule, VariantModule, ConfigModule, AuthModule],
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}
