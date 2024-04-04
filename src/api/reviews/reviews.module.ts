import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/infra/entities/review.entity';
import { ProductEntity } from 'src/infra/entities/product.entity';
import { UserEntity } from 'src/infra/entities/user.entity';
import { AdminEntity } from 'src/infra/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewEntity,
      ProductEntity,
      UserEntity,
      AdminEntity,
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
