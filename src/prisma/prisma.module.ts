import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Hamma joyda ishlatish uchun Global qilib qo'yamiz
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
