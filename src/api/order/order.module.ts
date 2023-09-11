import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/infra/entities/order.entity';
import { UserEntity } from 'src/infra/entities/user.entity';
import { CartEntity } from 'src/infra/entities/cart.entity';
import { AdminEntity } from 'src/infra/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      UserEntity,
      CartEntity,
      AdminEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
