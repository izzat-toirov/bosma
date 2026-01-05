import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context) {
    this.logger.log('JwtAuthGuard canActivate called');
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    this.logger.log(`Authorization header: ${authHeader}`);

    return super.canActivate(context);
  }

  // Override handleRequest to customize error messages and add logging
  handleRequest(err, user, info) {
    this.logger.log(
      `handleRequest called - err: ${err}, user: ${!!user}, info: ${info?.message}`,
    );

    // If there's an error (e.g., token expired, invalid token)
    if (err || !user) {
      this.logger.error(
        `Authentication failed - err: ${err}, user: ${!!user}, info: ${info?.message}`,
      );

      // Provide a user-friendly error message instead of technical details
      if (info?.message) {
        if (info.message === 'jwt expired') {
          throw new UnauthorizedException('Your session has expired');
        } else if (
          info.message.includes('invalid signature') ||
          info.message.includes('invalid token')
        ) {
          throw new UnauthorizedException('Please provide a valid token');
        }
      }

      // If no token is provided or other authentication issues
      if (!info) {
        throw new UnauthorizedException('Please provide a valid token');
      }

      // Default error message
      throw new UnauthorizedException(
        info?.message || 'Please provide a valid token',
      );
    }

    this.logger.log(`User authenticated successfully: ${user.id}`);
    return user;
  }
}
