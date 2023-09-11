import { HttpException, Injectable } from '@nestjs/common';
import { CreateNestedCategoryDto } from './dto/create-nested-category.dto';
import { UpdateNestedCategoryDto } from './dto/update-nested-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NestedCategoryEntity } from 'src/infra/entities/nested-category.entity';
import { NestedCategoryRepo } from 'src/infra/repos/nested-category.repo';
import { CategoryRepo } from 'src/infra/repos/category.repo';
import { CategoryEntity } from 'src/infra/entities/category.entity';

@Injectable()
export class NestedCategoryService {
  constructor(
    @InjectRepository(NestedCategoryEntity)
    private readonly nestedCategoryRepo: NestedCategoryRepo,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: CategoryRepo,
  ) {}

  async create(body: CreateNestedCategoryDto) {
    try {
      const findCategory = await this.categoryRepo.findOneBy({
        id: body.category_id,
      });

      if (!findCategory) throw new HttpException('Category ot found', 400);

      const newNestedCategory = await this.nestedCategoryRepo.create(body);
      await this.nestedCategoryRepo.save(newNestedCategory);

      return { message: 'success', data: newNestedCategory };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.nestedCategoryRepo.find({
        relations: ['category'],
      });

      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOne(id: number) {
    try {
      const findNestedCategory = await this.nestedCategoryRepo.findOneBy({
        id,
      });

      if (!findNestedCategory)
        throw new HttpException('NestedCategory not found', 400);

      return { message: 'success', data: findNestedCategory };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(id: number, body: UpdateNestedCategoryDto) {
    try {
      const findNestedCategory = await this.nestedCategoryRepo.findOneBy({
        id,
      });

      if (!findNestedCategory)
        throw new HttpException('NestedCategory not found', 400);

      await this.nestedCategoryRepo.update(id, body);
      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: number) {
    try {
      const findNestedCategory = await this.nestedCategoryRepo.findOneBy({
        id,
      });

      if (!findNestedCategory)
        throw new HttpException('NestedCategory not found', 400);

      await this.nestedCategoryRepo.delete(id);

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
