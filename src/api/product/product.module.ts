import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/infra/entities/product.entity';
import { CatalogEntity } from 'src/infra/entities/catalog.entity';
import { CategoryEntity } from 'src/infra/entities/category.entity';
import { NestedCategoryEntity } from 'src/infra/entities/nested-category.entity';
import { DiscountEntity } from 'src/infra/entities/discount.entity';
import { BrandEntity } from 'src/infra/entities/brand.entity';
import { ReviewEntity } from 'src/infra/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      CatalogEntity,
      CategoryEntity,
      NestedCategoryEntity,
      DiscountEntity,
      BrandEntity,
      ReviewEntity,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
