import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from 'src/infra/entities/cart.entity';
import { UserEntity } from 'src/infra/entities/user.entity';
import { OrderEntity } from 'src/infra/entities/order.entity';
import { ProductEntity } from 'src/infra/entities/product.entity';
import { AdminEntity } from 'src/infra/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      UserEntity,
      OrderEntity,
      ProductEntity,
      AdminEntity,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
