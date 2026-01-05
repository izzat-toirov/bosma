import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(orderData: any) {
    // Calculate total price from order items
    const totalPrice = orderData.items.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Use Prisma transaction for complex operations
    const result = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: orderData.userId,
          status: 'PENDING' as any,
          paymentStatus: 'PENDING' as any,
          totalPrice,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          region: orderData.region || 'Unknown',
          address: orderData.address || orderData.deliveryAddress || 'Unknown',
          items: {
            create: orderData.items.map((item: any) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              frontDesign: item.frontDesign || undefined,
              backDesign: item.backDesign || undefined,
              frontPreviewUrl: item.frontPreviewUrl,
              backPreviewUrl: item.backPreviewUrl,
            })),
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      return order;
    });

    return result;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    status?: string,
    paymentStatus?: string,
    search?: string,
    userId?: number,
  ) {
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (paymentStatus) {
      whereClause.paymentStatus = paymentStatus;
    }

    if (userId) {
      whereClause.userId = userId;
    }

    if (search) {
      whereClause.OR = [
        { customerPhone: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orders = await this.prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const total = await this.prisma.order.count({ where: whereClause });

    return {
      data: orders,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        perPage: limit,
      },
    };
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateData: any) {
    // Recalculate total price if items are updated
    let totalPrice = undefined;
    if (updateData.items) {
      totalPrice = updateData.items.reduce((sum: number, item: any) => {
        return sum + item.price * item.quantity;
      }, 0);
    }

    const updatePayload: any = { ...updateData };
    if (totalPrice !== undefined) {
      updatePayload.totalPrice = totalPrice;
    }

    // Remove items from payload as they need to be handled separately
    if (updatePayload.items) {
      delete updatePayload.items;
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: updatePayload,
      include: {
        items: true,
      },
    });

    // If items were provided, update them
    if (updateData.items) {
      // First, delete existing items
      await this.prisma.orderItem.deleteMany({
        where: { orderId: id },
      });

      // Then create new items
      await this.prisma.orderItem.createMany({
        data: updateData.items.map((item: any) => ({
          orderId: id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          frontDesign: item.frontDesign || undefined,
          backDesign: item.backDesign || undefined,
          frontPreviewUrl: item.frontPreviewUrl,
          backPreviewUrl: item.backPreviewUrl,
        })),
      });
    }

    // Return updated order with items
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await this.prisma.order.delete({
      where: { id },
    });

    return { message: `Order with ID ${id} has been deleted` };
  }

  async placeOrderFromCart(userId: number, shippingDetails: any) {
    // Get user's cart with items
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.variant.price * item.quantity;
    }, 0);

    // Create order in a transaction
    return await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          status: 'PENDING' as any,
          paymentStatus: 'PENDING' as any,
          totalPrice,
          customerName: shippingDetails.customerName,
          customerPhone: shippingDetails.customerPhone,
          region: shippingDetails.region || 'Unknown',
          address:
            shippingDetails.address ||
            shippingDetails.deliveryAddress ||
            'Unknown',
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.variant.price,
              frontDesign: item.frontDesign || undefined,
              backDesign: item.backDesign || undefined,
              frontPreviewUrl: item.frontPreviewUrl,
              backPreviewUrl: item.backPreviewUrl,
            })),
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      // Clear the cart after creating the order
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  async findUserOrders(userId: number) {
    return await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getOrderPrintDetails(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }
}
