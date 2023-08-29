import { HttpException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from 'src/infra/entities/cart.entity';
import { CartRepo } from 'src/infra/repos/cart.repo';
import { UserEntity } from 'src/infra/entities/user.entity';
import { UserRepo } from 'src/infra/repos/user.repo';
import { OrderEntity } from 'src/infra/entities/order.entity';
import { OrderRepo } from 'src/infra/repos/order.repo';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity) private readonly cartRepo: CartRepo,
    @InjectRepository(OrderEntity) private readonly orderRepo: OrderRepo,
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepo,
  ) {}
  async create(body: CreateCartDto) {
    const findUser = await this.userRepo.findOneBy({
      id: body.user_id,
    });

    if (!findUser) throw new HttpException('User not found', 400);
    const newCart = await this.cartRepo.create(body);

    await this.cartRepo.save(newCart);

    return { message: 'success', data: newCart };
  }

  async findAll() {
    const data = await this.cartRepo.find({
      relations: ['user', 'product', 'order'],
    });

    return { message: 'Success', data };
  }

  async findOne(id: number) {
    const findCart = await this.cartRepo.findOneBy({ id });

    if (!findCart) throw new HttpException('Cart not found', 400);

    return { message: 'Success', data: findCart };
  }

  async update(id: number, body: UpdateCartDto) {
    const findOrder = await this.orderRepo.findOneBy({ id: body.order_id });

    const findCart = await this.cartRepo.findOneBy({ id });

    if (!findOrder) throw new HttpException('Order not found', 400);
    if (!findCart) throw new HttpException('Cart not found', 400);

    await this.cartRepo.update(id, body);

    return { message: 'Success' };
  }

  async remove(id: number) {
    const findCart = await this.cartRepo.findOneBy({ id });

    if (!findCart) throw new HttpException('Cart not found', 400);

    await this.cartRepo.delete(id);

    return { message: 'Success' };
  }
}
