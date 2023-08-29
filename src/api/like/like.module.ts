import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from 'src/infra/entities/like.entity';
import { UserEntity } from 'src/infra/entities/user.entity';
import { ProductEntity } from 'src/infra/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity, UserEntity, ProductEntity])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
