import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryEntity } from 'src/infra/entities/delivery.entity';
import { PostamatEntity } from 'src/infra/entities/postamat.entity';
import { UserAddressEntity } from 'src/infra/entities/user-adress.entity';
import { LocationEntity } from 'src/infra/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliveryEntity,
      PostamatEntity,
      UserAddressEntity,
      LocationEntity,
    ]),
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
