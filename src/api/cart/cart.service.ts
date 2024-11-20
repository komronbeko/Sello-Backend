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
import { ProductEntity } from 'src/infra/entities/product.entity';
import { ProductRepo } from 'src/infra/repos/product.repo';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity) private readonly cartRepo: CartRepo,
    @InjectRepository(ProductEntity) private readonly productRepo: ProductRepo,
    @InjectRepository(OrderEntity) private readonly orderRepo: OrderRepo,
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepo,
  ) {}

  async create(body: CreateCartDto, user_id: string) {
    try {
      const { product_id } = body;

      const findUser = await this.userRepo.findOneBy({
        id: user_id,
      });

      const findProduct = await this.productRepo.findOneBy({
        id: product_id,
      });

      if (!findUser) throw new HttpException('User not found', 400);
      if (!findProduct) throw new HttpException('User not found', 400);

      const findCartProduct = await this.cartRepo.findOneBy({
        user_id,
        product_id,
        status: 'unpaid',
      });

      if (findCartProduct) {
        await this.cartRepo.update(findCartProduct.id, {
          count: findCartProduct.count + 1,
        });
        return { message: 'Success' };
      }

      const newCart = await this.cartRepo.create({
        product_id,
        user_id,
        count: 1,
      });

      await this.cartRepo.save(newCart);

      return { message: 'success', data: newCart };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.cartRepo.find({
        relations: ['user', 'product.discount', 'order', 'product.photos'],
      });

      return { message: 'Success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async getUserCarts(user_id: string) {
    try {
      const data = await this.cartRepo.find({
        where: { user_id },
        relations: ['user', 'product.discount', 'order', 'product.photos'],
        order: { updated_at: 'ASC' },
      });

      return { message: 'Success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(id: string, body: UpdateCartDto) {
    try {
      const findOrder = await this.orderRepo.findOneBy({ id: body.order_id });

      const findCart = await this.cartRepo.findOneBy({ id });

      if (!findOrder) throw new HttpException('Order not found', 400);
      if (!findCart) throw new HttpException('Cart not found', 400);

      await this.cartRepo.update(id, body);

      return { message: 'Success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async minusCount(id: string) {
    try {
      const findCart = await this.cartRepo.findOneBy({ id });

      if (!findCart) throw new HttpException('Cart not found', 400);

      if (findCart.count < 1) throw new HttpException('Fatal', 400);

      await this.cartRepo.update(id, { count: findCart.count - 1 });

      return { message: 'Decremented to 1' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async plusCount(id: string) {
    try {
      const findCart = await this.cartRepo.findOneBy({ id });

      if (!findCart) throw new HttpException('Cart not found', 400);

      await this.cartRepo.update(id, { count: findCart.count + 1 });

      return { message: 'Decremented to 1' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async removeOne(id: string) {
    try {
      const findCart = await this.cartRepo.findOneBy({ id });

      if (!findCart) throw new HttpException('Cart not found', 400);

      await this.cartRepo.delete(id);

      return { message: 'Deleted Succesfully' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async removeAll(user_id: string) {
    try {
      await this.cartRepo.delete({ user_id, status: 'unpaid' });

      return { message: 'Deleted Succesfully' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
