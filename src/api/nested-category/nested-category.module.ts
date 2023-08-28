import { Module } from '@nestjs/common';
import { NestedCategoryService } from './nested-category.service';
import { NestedCategoryController } from './nested-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/infra/entities/category.entity';
import { NestedCategoryEntity } from 'src/infra/entities/nested-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, NestedCategoryEntity])],
  controllers: [NestedCategoryController],
  providers: [NestedCategoryService],
})
export class NestedCategoryModule {}
