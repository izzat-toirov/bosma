import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notification } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(notificationData: any) {
    const notification = await this.prisma.notification.create({
      data: {
        ...notificationData,
      },
    });

    return notification;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    userId?: number,
    isRead?: boolean,
    type?: string,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (userId) {
      whereClause.userId = userId;
    }

    if (isRead !== undefined) {
      whereClause.isRead = isRead;
    }

    if (type) {
      whereClause.type = type;
    }

    if (search) {
      whereClause.message = { contains: search, mode: 'insensitive' };
    }

    const notifications = await this.prisma.notification.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const total = await this.prisma.notification.count({ where: whereClause });

    return {
      data: notifications,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        perPage: limit,
      },
    };
  }

  async findOne(id: number, userId?: number) {
    const whereClause: any = { id };

    // If userId is provided, ensure the notification belongs to the user
    if (userId) {
      whereClause.userId = userId;
    }

    const notification = await this.prisma.notification.findUnique({
      where: whereClause,
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(id: number, updateData: any, userId?: number) {
    const whereClause: any = { id };

    // If userId is provided, ensure the notification belongs to the user
    if (userId) {
      whereClause.userId = userId;
    }

    const notification = await this.prisma.notification.update({
      where: whereClause,
      data: updateData,
    });

    return notification;
  }

  async remove(id: number, userId?: number) {
    const whereClause: any = { id };

    // If userId is provided, ensure the notification belongs to the user
    if (userId) {
      whereClause.userId = userId;
    }

    const notification = await this.prisma.notification.findUnique({
      where: whereClause,
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    await this.prisma.notification.delete({
      where: whereClause,
    });

    return { message: `Notification with ID ${id} has been deleted` };
  }

  async markAsRead(id: number, userId?: number) {
    const whereClause: any = { id };

    // If userId is provided, ensure the notification belongs to the user
    if (userId) {
      whereClause.userId = userId;
    }

    const notification = await this.prisma.notification.update({
      where: whereClause,
      data: { isRead: true },
    });

    return notification;
  }

  async markAllAsRead(userId: number) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { message: `${result.count} notifications marked as read` };
  }

  async getUnreadCount(userId: number) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { count };
  }
}
