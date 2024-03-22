import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/infra/entities/category.entity';
import { CategoryRepo } from 'src/infra/repos/category.repo';
import { CatalogRepo } from 'src/infra/repos/catalog.repo';
import { CatalogEntity } from 'src/infra/entities/catalog.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: CategoryRepo,
    @InjectRepository(CatalogEntity)
    private readonly catalogRepo: CatalogRepo,
  ) {}

  async create(body: CreateCategoryDto) {
    try {
      const findCatalog = await this.catalogRepo.findOneBy({
        id: body.catalog_id,
      });

      if (!findCatalog) throw new HttpException('Catalog ot found', 400);

      const newCategory = await this.categoryRepo.create(body);
      await this.categoryRepo.save(newCategory);

      return { message: 'success', data: newCategory };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.categoryRepo.find({
        relations: ['catalog', 'nestedCategories', 'products'],
      });

      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOne(id: number) {
    try {
      const findCategory = await this.categoryRepo.findOneBy({ id });

      if (!findCategory) throw new HttpException('Category not found', 400);

      return { message: 'success', data: findCategory };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(id: number, body: UpdateCategoryDto) {
    try {
      const findCategory = await this.categoryRepo.findOneBy({ id });

      if (!findCategory) throw new HttpException('Category not found', 400);

      await this.categoryRepo.update(id, body);
      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: number) {
    try {
      const findCategory = await this.categoryRepo.findOneBy({ id });

      if (!findCategory) throw new HttpException('Category not found', 400);

      await this.categoryRepo.delete(id);

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
