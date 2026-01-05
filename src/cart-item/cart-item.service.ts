import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartRequestDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemService {
  constructor(private prisma: PrismaService) {}

  // Faqat bitta itemni olish (Xavfsizlik uchun userId bilan tekshiramiz)
  async findOne(id: number, userId: number) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { 
        id,
        cart: { userId } // Tekshiruv: bu item haqiqatdan shu userga tegishlimi?
      },
      include: {
        variant: { include: { product: true } },
      },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');
    return cartItem;
  }

  // Itemni yangilash
  async update(id: number, userId: number, dto: UpdateCartRequestDto) {
    // Avval item egasini tekshiramiz
    await this.findOne(id, userId);

    return await this.prisma.cartItem.update({
      where: { id },
      data: {
        quantity: dto.quantity,
        // Dizayn o'zgarsa (ixtiyoriy)
        frontDesign: dto.frontDesign as any,
        backDesign: dto.backDesign as any,
      },
    });
  }

  // Itemni o'chirish
  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.prisma.cartItem.delete({ where: { id } });
    return { message: 'Item deleted successfully' };
  }
}