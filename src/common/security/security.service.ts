import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class SecurityService {
  constructor(private prisma: PrismaService) {}

  /**
   * Validates that a user can only access resources they own
   * @param userId The ID of the authenticated user
   * @param resourceUserId The ID of the user who owns the resource
   * @param resourceName The name of the resource for error messages
   */
  validateOwnership(
    userId: number,
    resourceUserId: number,
    resourceName: string = 'resource',
  ): void {
    if (userId !== resourceUserId) {
      throw new ForbiddenException(
        `Access denied: You can only access your own ${resourceName}`,
      );
    }
  }

  /**
   * Validates that a user has the required role
   * @param userRole The role of the authenticated user
   * @param requiredRole The role required to perform the action
   */
  validateRole(userRole: Role, requiredRole: Role): void {
    const roleHierarchy = {
      [Role.USER]: 1,
      [Role.ADMIN]: 2,
      [Role.SUPER_ADMIN]: 3,
    };

    if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
      const requiredRoleName =
        requiredRole === Role.ADMIN ? 'ADMIN' : 'SUPER_ADMIN';
      throw new ForbiddenException(
        `Insufficient permissions: Required ${requiredRoleName} role`,
      );
    }
  }

  /**
   * Validates that a SUPER_ADMIN user is making the request
   * @param userRole The role of the authenticated user
   */
  validateSuperAdmin(userRole: Role): void {
    if (userRole !== Role.SUPER_ADMIN) {
      throw new ForbiddenException(
        'Insufficient permissions: Required SUPER_ADMIN role',
      );
    }
  }

  /**
   * Validates that a role is valid
   * @param role The role to validate
   */
  validateRoleAssignment(role: Role): void {
    if (!Object.values(Role).includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }
  }

  /**
   * Checks if an asset is being used in any cart items or order items
   * @param assetUrl The URL of the asset to check
   */
  async checkAssetUsage(
    assetUrl: string,
  ): Promise<{ cartItems: number; orderItems: number }> {
    const cartItemsUsingAsset = await this.prisma.cartItem.count({
      where: {
        OR: [
          { frontPreviewUrl: { contains: assetUrl } },
          { backPreviewUrl: { contains: assetUrl } },
        ],
      },
    });

    const orderItemsUsingAsset = await this.prisma.orderItem.count({
      where: {
        OR: [
          { frontPreviewUrl: { contains: assetUrl } },
          { backPreviewUrl: { contains: assetUrl } },
        ],
      },
    });

    return { cartItems: cartItemsUsingAsset, orderItems: orderItemsUsingAsset };
  }
}
