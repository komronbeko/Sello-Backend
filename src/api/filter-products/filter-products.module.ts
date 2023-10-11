import { Module } from '@nestjs/common';
import { FilterProductsService } from './filter-products.service';
import { FilterProductsController } from './filter-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/infra/entities/product.entity';
import { CatalogEntity } from 'src/infra/entities/catalog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CatalogEntity])],
  controllers: [FilterProductsController],
  providers: [FilterProductsService],
})
export class FilterProductsModule {}
