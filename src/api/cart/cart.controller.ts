import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { myReq } from 'src/infra/interfaces/custom-request';

@ApiTags('Carts')
@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @Req() request: myReq) {
    return this.cartService.create(createCartDto, +request.userId);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get('/ofuser')
  getUserCarts(@Req() req: myReq) {
    return this.cartService.getUserCarts(+req.userId);
  }

  @Patch()
  update(@Req() req: myReq, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+req.userId, updateCartDto);
  }

  @Patch('/count/minus/:id')
  minusCount(@Param('id') id: string) {
    return this.cartService.minusCount(+id);
  }

  @Patch('/count/plus/:id')
  plusCount(@Param('id') id: string) {
    return this.cartService.plusCount(+id);
  }

  @Delete('/all')
  removeAll(@Req() req: myReq) {
    return this.cartService.removeAll(req.userId);
  }

  @Delete(':id')
  removeOne(@Param('id') id: string) {
    return this.cartService.removeOne(+id);
  }
}
