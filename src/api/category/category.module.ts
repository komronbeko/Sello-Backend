import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/infra/entities/category.entity';
import { CatalogEntity } from 'src/infra/entities/catalog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, CatalogEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
