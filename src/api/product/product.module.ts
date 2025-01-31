/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/infra/entities/product.entity';
import { CatalogEntity } from 'src/infra/entities/catalog.entity';
import { CategoryEntity } from 'src/infra/entities/category.entity';
import { NestedCategoryEntity } from 'src/infra/entities/nested-category.entity';
import { ReviewEntity } from 'src/infra/entities/review.entity';
import { UserEntity } from 'src/infra/entities/user.entity';
import { AdminEntity } from 'src/infra/entities/admin.entity';
import { PhotoEntity } from 'src/infra/entities/photo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      CatalogEntity,
      CategoryEntity,
      NestedCategoryEntity,
      ReviewEntity,
      UserEntity,
      AdminEntity,
      PhotoEntity,
      ProductEntity,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
