import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SecurityService } from '../common/security/security.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private securityService: SecurityService,
  ) {}

  async createSuperAdmin() {
    const email = 'admin@bosma.uz';

    // Check if any SUPER_ADMIN already exists in the system
    const existingSuperAdmin = await this.prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });

    if (existingSuperAdmin) {
      console.log('ℹ️ Super admin already exists');
      return;
    }

    await this.prisma.user.create({
      data: {
        fullName: 'Super Admin',
        email,
        phone: '+998900000000',
        password: await bcrypt.hash('Admin123!', 10),
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    console.log('✅ Super admin created');
  }

  // user.service.ts
  async create(createUserDto: CreateUserDto) {
    // Hard-block: Prevent creation of SUPER_ADMIN users
    if (createUserDto.role === 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'Cannot create SUPER_ADMIN users. Use createSuperAdmin() method instead.',
      );
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'User with this email or phone already exists',
      );
    }

    let hashedPassword = createUserDto.password;
    if (createUserDto.password) {
      hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    }

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        // AGAR DTO ichida isActive kelgan bo'lsa o'shani oladi (masalan false),
        // kelmagan bo'lsa (Admin qo'shayotganda) true bo'ladi.
        isActive:
          createUserDto.isActive !== undefined ? createUserDto.isActive : true,
      },
    });

    const { password, otpCode, otpExpires, hashedRefreshToken, ...result } =
      user;
    return result;
  }
  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id',
    sortOrder: 'asc' | 'desc' = 'desc',
    role?: string,
    isActive?: boolean,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (role) {
      whereClause.role = role;
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive;
    }

    if (search) {
      whereClause.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        region: true,
        address: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: true,
        otpCode: true,
        otpExpires: true,
        hashedRefreshToken: true,
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const total = await this.prisma.user.count({ where: whereClause });

    return {
      data: users.map((user) => {
        const { password, otpCode, otpExpires, hashedRefreshToken, ...result } =
          user;
        return result;
      }),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        perPage: limit,
      },
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        region: true,
        address: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: true,
        otpCode: true,
        otpExpires: true,
        hashedRefreshToken: true,
        assets: true,
        orders: {
          select: {
            id: true,
            status: true,
            paymentStatus: true,
            totalPrice: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Return user without sensitive data
    const { password, otpCode, otpExpires, hashedRefreshToken, ...result } =
      user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if role field is present in the DTO - silently remove it to allow SUPER_ADMIN to update profiles
    if (updateUserDto.role !== undefined) {
      // Remove role from the update data to prevent direct role changes
      delete updateUserDto.role;
    }

    // Check for duplicate email/phone if provided
    if (updateUserDto.email && existingUser.email !== updateUserDto.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: { email: updateUserDto.email },
      });
      if (emailExists) {
        throw new BadRequestException('Email already in use');
      }
    }

    if (updateUserDto.phone && existingUser.phone !== updateUserDto.phone) {
      const phoneExists = await this.prisma.user.findFirst({
        where: { phone: updateUserDto.phone },
      });
      if (phoneExists) {
        throw new BadRequestException('Phone number already in use');
      }
    }

    // Hash password if provided
    let hashedPassword = existingUser.password;
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Prepare update data, handling special fields like hashedRefreshToken
    const updateData: any = { ...updateUserDto, password: hashedPassword };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Return user without sensitive data
    const { password, otpCode, otpExpires, hashedRefreshToken, ...result } =
      updatedUser;
    return result;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Prevent deletion of SUPER_ADMIN users
    if (user.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('Cannot delete SUPER_ADMIN users.');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} has been deleted` };
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        region: true,
        address: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: true,
        otpCode: true,
        otpExpires: true,
        hashedRefreshToken: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findUserWithRefreshToken(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        region: true,
        address: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: true,
        otpCode: true,
        otpExpires: true,
        hashedRefreshToken: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async promoteUser(userId: number, newRole: Role, requestingUserId: number) {
    // Check if the target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Prevent any action that attempts to change the role of the existing SUPER_ADMIN
    if (targetUser.role === 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'Cannot change the role of the existing SUPER_ADMIN user.',
      );
    }

    // Then check if the requesting user is a SUPER_ADMIN
    const requestingUser = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requestingUser) {
      throw new NotFoundException(
        `Requesting user with ID ${requestingUserId} not found`,
      );
    }

    // Validate that only SUPER_ADMIN can promote users
    this.securityService.validateSuperAdmin(requestingUser.role);

    // Prevent SUPER_ADMIN from demoting themselves
    if (requestingUser.id === userId && requestingUser.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('SUPER_ADMIN cannot demote themselves.');
    }

    // Prevent anyone from assigning SUPER_ADMIN role
    if (newRole === 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'The SUPER_ADMIN role is unique and cannot be assigned.',
      );
    }

    // Validate that the new role is valid (this will exclude SUPER_ADMIN due to the check above)
    this.securityService.validateRoleAssignment(newRole);

    // Update the user's role
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // Return user without sensitive data
    const { password, otpCode, otpExpires, hashedRefreshToken, ...result } =
      updatedUser;
    return result;
  }
}
