import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { myReq } from 'src/infra/interfaces/custom-request';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Orders')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: myReq) {
    return this.orderService.create(createOrderDto, req.userId);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get('/ofuser')
  getUserOrders(@Req() req: myReq) {
    return this.orderService.getUserOrders(req.userId);
  }

  @Delete('cancel/:id')
  update(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
