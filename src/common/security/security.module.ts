import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { SecurityService } from './security.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [JwtAuthGuard, RolesGuard, HttpExceptionFilter, SecurityService],
  exports: [JwtAuthGuard, RolesGuard, HttpExceptionFilter, SecurityService],
})
export class SecurityModule {}
