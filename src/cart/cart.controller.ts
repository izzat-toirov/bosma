import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Foydalanuvchining shaxsiy savatchasini olish" })
  async getMyCart(@Req() req) {
    // Service-dagi yangi getMyCart metodini chaqiramiz
    return this.cartService.getMyCart(req.user.id);
  }

  @Post('add')
  @ApiOperation({ summary: "Savatchaga mahsulot qo'shish yoki sonini oshirish" })
  async addItem(@Req() req, @Body() dto: AddToCartDto) {
    return this.cartService.addItemToCart(
      req.user.id,
      dto.variantId,
      dto.quantity,
      {
        frontDesign: dto.frontDesign,
        backDesign: dto.backDesign,
        frontPreviewUrl: dto.frontPreviewUrl,
        backPreviewUrl: dto.backPreviewUrl,
      },
    );
  }

  @Patch('item/:id')
  @ApiOperation({ summary: "Savatchadagi konkret element sonini o'zgartirish" })
  async updateItem(
    @Req() req,
    @Param('id', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(req.user.id, itemId, dto.quantity);
  }

  @Delete('item/:id')
  @ApiOperation({ summary: "Savatchadan bitta elementni o'chirish" })
  async removeItem(@Req() req, @Param('id', ParseIntPipe) itemId: number) {
    return this.cartService.removeItem(req.user.id, itemId);
  }

  @Delete('clear')
  @ApiOperation({ summary: "Savatchani to'liq bo'shatish" })
  async clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }

  @Post('checkout')
  @ApiOperation({ summary: "Savatchani buyurtmaga aylantirish (Sotib olish)" })
  async checkout(@Req() req, @Body() orderDetails: any) {
    // Tranzaksiya orqali Order yaratadi va savatchani tozalaydi
    return this.cartService.convertCartToOrder(
      req.user.id,
      orderDetails,
    );
  }
}