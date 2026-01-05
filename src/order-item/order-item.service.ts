import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderItemRequestDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderItemDto: CreateOrderItemRequestDto) {
    // Check if order exists
    const order = await this.prisma.order.findUnique({
      where: { id: createOrderItemDto.orderId },
    });

    if (!order) {
      throw new NotFoundException(
        `Order with ID ${createOrderItemDto.orderId} not found`,
      );
    }

    // Check if variant exists
    const variant = await this.prisma.variant.findUnique({
      where: { id: createOrderItemDto.variantId },
    });

    if (!variant) {
      throw new NotFoundException(
        `Variant with ID ${createOrderItemDto.variantId} not found`,
      );
    }

    const orderItem = await this.prisma.orderItem.create({
      data: {
        ...createOrderItemDto,
        frontDesign: createOrderItemDto.frontDesign
          ? JSON.stringify(createOrderItemDto.frontDesign)
          : undefined,
        backDesign: createOrderItemDto.backDesign
          ? JSON.stringify(createOrderItemDto.backDesign)
          : undefined,
      },
    });

    return orderItem;
  }

  async findAll(orderId?: number) {
    const whereClause = orderId ? { orderId } : {};

    const orderItems = await this.prisma.orderItem.findMany({
      where: whereClause,
      include: {
        order: {
          select: {
            id: true,
            status: true,
          },
        },
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    // Parse JSON fields back to objects
    return orderItems.map((item) => ({
      ...item,
      frontDesign: item.frontDesign
        ? JSON.parse(item.frontDesign as string)
        : null,
      backDesign: item.backDesign
        ? JSON.parse(item.backDesign as string)
        : null,
    }));
  }

  async findOne(id: number) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            status: true,
          },
        },
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    // Parse JSON fields back to objects
    return {
      ...orderItem,
      frontDesign: orderItem.frontDesign
        ? JSON.parse(orderItem.frontDesign as string)
        : null,
      backDesign: orderItem.backDesign
        ? JSON.parse(orderItem.backDesign as string)
        : null,
    };
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id },
    });

    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    // Check if order exists if it's being updated
    if (updateOrderItemDto.orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: updateOrderItemDto.orderId },
      });

      if (!order) {
        throw new NotFoundException(
          `Order with ID ${updateOrderItemDto.orderId} not found`,
        );
      }
    }

    // Check if variant exists if it's being updated
    if (updateOrderItemDto.variantId) {
      const variant = await this.prisma.variant.findUnique({
        where: { id: updateOrderItemDto.variantId },
      });

      if (!variant) {
        throw new NotFoundException(
          `Variant with ID ${updateOrderItemDto.variantId} not found`,
        );
      }
    }

    const updatedOrderItem = await this.prisma.orderItem.update({
      where: { id },
      data: {
        ...updateOrderItemDto,
        frontDesign: updateOrderItemDto.frontDesign
          ? JSON.stringify(updateOrderItemDto.frontDesign)
          : undefined,
        backDesign: updateOrderItemDto.backDesign
          ? JSON.stringify(updateOrderItemDto.backDesign)
          : undefined,
      },
    });

    // Parse JSON fields back to objects
    return {
      ...updatedOrderItem,
      frontDesign: updatedOrderItem.frontDesign
        ? JSON.parse(updatedOrderItem.frontDesign as string)
        : null,
      backDesign: updatedOrderItem.backDesign
        ? JSON.parse(updatedOrderItem.backDesign as string)
        : null,
    };
  }

  async remove(id: number) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id },
    });

    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    await this.prisma.orderItem.delete({
      where: { id },
    });

    return { message: `OrderItem with ID ${id} has been deleted` };
  }
}
