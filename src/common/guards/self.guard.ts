import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
// import { ProductService } from '../../product/product.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class SelfOrRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // private productService: ProductService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params?.id ? Number(request.params.id) : null;


    // OWNER doim ruxsat oladi
    if (user.role === 'SUPER_ADMIN') return true;

    // === ADMIN qoidalari ===
    if (user.role === 'ADMIN') {
      if (request.originalUrl.includes('/users')) {
        if (resourceId !== null) {
          const targetUser = await this.userService.findOne(resourceId);

          if (!targetUser) {
            throw new ForbiddenException('Foydalanuvchi topilmadi');
          }

          // Admin boshqa ADMINni ko‘rmasin
          if (targetUser.role === 'ADMIN' && targetUser.id !== user.id) {
            throw new ForbiddenException(
              'Admin boshqa adminlarni ko‘ra olmaydi',
            );
          }

          // Admin OWNERni ko‘rmasin
          if (targetUser.role === 'SUPER_ADMIN') {
            throw new ForbiddenException('Admin SUPER_ADMINni ko‘ra olmaydi');
          }
        }
        return true; // qolgan userlarni ko‘ra oladi
      }

      if (request.baseUrl.includes('/product')) {
        if (resourceId !== null) {
          // const product = await this.productService.findOne(resourceId);
          // if (product.userId === user.id) return true;
          throw new ForbiddenException(
            'Admin faqat o‘zi yaratgan productni boshqarishi mumkin',
          );
        }
      }

      if (request.baseUrl.includes('/category')) {
        if (resourceId !== null) {
          // TODO: CategoryService qo‘shiladi
          throw new ForbiddenException(
            'Admin faqat o‘zi yaratgan categoryni boshqarishi mumkin',
          );
        }
      }
    }

    // === USER qoidalari ===
    if (user.role === 'USER') {
      if (request.originalUrl.includes('/users')) {
        // GET /users (resourceId yo‘q) -> taqiqlanadi
        if (!resourceId) {
          throw new ForbiddenException(
            'User barcha foydalanuvchilarni ko‘ra olmaydi',
          );
        }

        // GET /users/:id -> faqat o‘zini ko‘ra oladi
        if (user.id === resourceId) return true;

        throw new ForbiddenException(
          'User faqat o‘z profilini ko‘rishi mumkin',
        );
      }

      if (request.baseUrl.includes('/product')) {
        if (resourceId !== null) {
          // const product = await this.productService.findOne(resourceId);
          // if (product.userId === user.id) return true;
        }
        throw new ForbiddenException(
          'User faqat o‘zi yaratgan productni boshqarishi mumkin',
        );
      }

      if (request.baseUrl.includes('/category')) {
        if (resourceId !== null) {
          // TODO: CategoryService qo‘shiladi
          throw new ForbiddenException(
            'User faqat o‘zi yaratgan categoryni boshqarishi mumkin',
          );
        }
      }
    }

    throw new ForbiddenException('Ruxsat yo‘q');
  }
}
