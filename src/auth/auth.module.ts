import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { SecurityModule } from '../common/security/security.module';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    UserModule,
    SecurityModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        const accessTokenTime = configService
          .get<string>('ACCESS_TOKEN_TIME', '15m')
          .replace(/"/g, '');
        if (!jwtSecret) {
          throw new Error('JWT_SECRET environment variable is not set');
        }
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: accessTokenTime as any },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
