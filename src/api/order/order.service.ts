import { v4 as uuid } from 'uuid';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/infra/entities/order.entity';
import { OrderRepo } from 'src/infra/repos/order.repo';
import { UserEntity } from 'src/infra/entities/user.entity';
import { UserRepo } from 'src/infra/repos/user.repo';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: OrderRepo,
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepo,
  ) {}

  async create(body: CreateOrderDto) {
    const { user_id, cost, status } = body;

    const findUser = await this.userRepo.findOneBy({
      id: user_id,
    });

    const secret_code = uuid().split('-')[0];

    if (!findUser) throw new HttpException('Cart ot found', 400);

    const newOrder = await this.orderRepo.create({
      user_id,
      cost,
      status,
      secret_code,
    });
    await this.orderRepo.save(newOrder);

    return { message: 'success', data: newOrder };
  }

  async findAll() {
    const data = await this.orderRepo.find({
      relations: ['carts', 'user'],
    });

    return { message: 'success', data };
  }

  async findOne(id: number) {
    const findOrder = await this.orderRepo.findOneBy({ id });

    if (!findOrder) throw new HttpException('Order not found', 400);

    return { message: 'success', data: findOrder };
  }

  async update(id: number, body: UpdateOrderDto) {
    const findOrder = await this.orderRepo.findOneBy({ id });

    if (!findOrder) throw new HttpException('Order not found', 400);

    await this.orderRepo.update(id, body);
    return { message: 'success' };
  }

  async remove(id: number) {
    const findOrder = await this.orderRepo.findOneBy({ id });

    if (!findOrder) throw new HttpException('Order not found', 400);

    await this.orderRepo.delete(id);

    return { message: 'success' };
  }
}
