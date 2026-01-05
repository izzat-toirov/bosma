import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserService } from '../../user/user.service';
// import { ProductService } from '../../product/product.service';

@Injectable()
export class GetAllGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    // private productService: ProductService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // === OWNER doim ruxsat oladi ===
    if (user.role === 'SUPER_ADMIN') return true;

    // === ADMIN qoidalari ===
    if (user.role === 'ADMIN') {
      if (request.originalUrl.includes('/users')) {
        // Admin faqat USERlarni ko‘ra oladi
        // Service ichida filter qilib qo‘yiladi:
        // SELECT * FROM users WHERE role = 'USER';
        return true;
      }

      if (request.originalUrl.includes('/product')) {
        // Admin faqat o‘zi yaratgan productlarni ko‘rishi mumkin
        // Service da filter:
        // SELECT * FROM products WHERE userId = user.id;
        return true;
      }
    }

    // === USER qoidalari ===
    if (user.role === 'USER') {
      if (request.originalUrl.includes('/users')) {
        // Faqat o‘zini qaytarishi mumkin
        // Service da filter:
        // SELECT * FROM users WHERE id = user.id;
        return true;
      }

      if (request.originalUrl.includes('/product')) {
        // User faqat o‘zi yaratgan productlarni ko‘rishi mumkin
        return true;
      }
    }

    throw new ForbiddenException('Ruxsat yo‘q');
  }
}
