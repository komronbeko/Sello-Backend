import { Module } from '@nestjs/common';
import { ProductInfoService } from './product-info.service';
import { ProductInfoController } from './product-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/infra/entities/product.entity';
import { ProductInfoEntity } from 'src/infra/entities/product-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductInfoEntity])],
  controllers: [ProductInfoController],
  providers: [ProductInfoService],
})
export class ProductInfoModule {}
