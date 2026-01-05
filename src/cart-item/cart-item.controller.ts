import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateCartRequestDto } from './dto/update-cart-item.dto';

@ApiTags('Cart Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.cartItemService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() dto: UpdateCartRequestDto,
  ) {
    return this.cartItemService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.cartItemService.remove(id, req.user.id);
  }
}