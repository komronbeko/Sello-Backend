import { HttpException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/infra/entities/user.entity';
import { UserRepo } from 'src/infra/repos/user.repo';
import { FindOneOptions } from 'typeorm';
import { ReplenishBalanceDto } from './dto/replenish-balance.dto';
import Stripe from 'stripe';

const stripeService = new Stripe(
  'sk_test_51NXavzDU6UVW8TMJIUiWGby01OgMS2J0Pi4hZ66w9eajUY6tgR9FfMN814qlnxzqNifHObnVogFi39wyBci2fdSl00fPhEDzO2',
  { apiVersion: '2023-08-16' },
);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: UserRepo,
  ) {}
  async findAll() {
    const data = await this.userRepo.find({ relations: ['carts', 'likes'] });
    return { message: 'success', data };
  }

  async replenishUserBalance(user_id: number, body: ReplenishBalanceDto) {
    const { amount, id } = body;

    const findUser = await this.userRepo.findOne({ where: { id: user_id } });

    if (!findUser) throw new HttpException('User not found', 400);

    const payment = await stripeService.paymentIntents.create({
      amount,
      currency: 'USD',
      description: 'Payment',
      payment_method: id,
      confirm: true,
      return_url: 'https://example.com/return-url', // Specify your return URL here
    });

    await this.userRepo.update(user_id, {
      money_amount: findUser.money_amount + amount,
    });

    return { message: 'success', data: payment };
  }

  async findOne(id: number) {
    const findUser = await this.userRepo.findOne({
      where: { id },
      relations: ['carts', 'likes'],
    } as FindOneOptions);

    if (!findUser) throw new HttpException('User not found', 400);

    return { message: 'success', data: findUser };
  }

  async update(id: number, body: UpdateUserDto) {
    const findUser = await this.userRepo.findOneBy({ id });

    if (!findUser) throw new HttpException('User not found', 400);

    await this.userRepo.update(id, body);
    return `This action updates a #${id} user`;
  }
}
