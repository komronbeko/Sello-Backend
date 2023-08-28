import { Module } from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { UserAddressController } from './user-address.controller';
import { UserAddressEntity } from 'src/infra/entities/user-adress.entity';
import { UserEntity } from 'src/infra/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddressEntity, UserEntity])],
  controllers: [UserAddressController],
  providers: [UserAddressService],
})
export class UserAddressModule {}
