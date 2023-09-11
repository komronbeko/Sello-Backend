import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/infra/entities/user.entity';
import { AdminEntity } from 'src/infra/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AdminEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
