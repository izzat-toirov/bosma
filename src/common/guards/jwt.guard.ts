import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import type { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request | any = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token not provided');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    let payload: any;
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new InternalServerErrorException(
        'JWT_SECRET environment variable is not set',
      );
    }

    try {
      payload = await this.jwtService.verify(token, {
        secret: jwtSecret,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    // Fetch user from DB
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub || payload.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        region: true,
        address: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User is not active');
    }

    req.user = user;
    return true;
  }
}
