import { v4 as uuid } from 'uuid';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/infra/entities/order.entity';
import { OrderRepo } from 'src/infra/repos/order.repo';
import { UserEntity } from 'src/infra/entities/user.entity';
import { UserRepo } from 'src/infra/repos/user.repo';
import { CartEntity } from 'src/infra/entities/cart.entity';
import { CartRepo } from 'src/infra/repos/cart.repo';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: OrderRepo,
    @InjectRepository(CartEntity)
    private readonly cartRepo: CartRepo,
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepo,
  ) {}

  async create(body: CreateOrderDto, user_id: number) {
    try {
      const { cost, location } = body;

      const findUserCarts = await this.cartRepo.findBy({
        user_id,
        status: 'unpaid',
      });

      const findUser = await this.userRepo.findOneBy({
        id: user_id,
      });

      const secret_code = uuid().split('-')[0];
      const strLocation = JSON.stringify(location);

      if (!findUser) throw new HttpException('User not found', 400);
      if (!findUserCarts.length) throw new HttpException('Cart not found', 400);

      if (!findUser.money_amount || findUser.money_amount < cost)
        throw new HttpException('Not enough money in the cash', 400);

      await this.userRepo.update(user_id, {
        money_amount: findUser.money_amount - cost,
      });

      const newOrder = await this.orderRepo.create({
        user_id,
        cost,
        secret_code,
        location: strLocation,
      });
      await this.orderRepo.save(newOrder);

      findUserCarts.forEach(async (cart) => {
        cart.order_id = newOrder.id;
        cart.status = 'paid';
        await this.cartRepo.save(cart);
      });

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.orderRepo.find({
        relations: ['carts', 'user'],
      });

      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOne(id: number) {
    try {
      const findOrder = await this.orderRepo.findOneBy({ id });

      if (!findOrder) throw new HttpException('Order not found', 400);

      return { message: 'success', data: findOrder };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async getUserOrders(user_id: number) {
    try {
      const data = await this.orderRepo.find({
        where: { user_id },
        relations: ['user', 'carts.product'],
      });

      return { message: 'Success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async cancelOrder(id: number) {
    try {
      const findOrder = await this.orderRepo.findOneBy({ id });

      if (!findOrder) {
        throw new HttpException('Order not found', 400);
      }

      await this.orderRepo.update(id, { status: 'canceled' });

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: number) {
    try {
      const findOrder = await this.orderRepo.findOneBy({ id });

      if (!findOrder) throw new HttpException('Order not found', 400);

      await this.orderRepo.delete(id);

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
