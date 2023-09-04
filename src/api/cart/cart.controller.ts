import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@ApiTags('Carts')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':user_id')
  getUserCarts(@Param('user_id') user_id: string) {
    return this.cartService.getUserCarts(+user_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Patch('/count/minus/:id')
  minusCount(@Param('id') id: string) {
    return this.cartService.minusCount(+id);
  }

  @Patch('/count/plus/:id')
  plusCount(@Param('id') id: string) {
    return this.cartService.plusCount(+id);
  }

  @Delete(':id')
  removeOne(@Param('id') id: string) {
    return this.cartService.removeOne(+id);
  }

  @Delete('/all/:user_id')
  removeAll(@Param('user_id') user_id: string) {
    return this.cartService.removeAll(+user_id);
  }
}
