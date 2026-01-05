import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required for this route from the decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the user from the request (this comes from JWT strategy)
    const { user } = context.switchToHttp().getRequest();

    // Check if the user's role is included in the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);

    // If user doesn't have the required role, throw a descriptive error message
    if (!hasRole) {
      throw new ForbiddenException(
        `You are a ${user.role}, but you need ADMIN role for this`,
      );
    }

    return true;
  }
}
