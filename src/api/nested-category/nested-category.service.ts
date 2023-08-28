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
    const findCategory = await this.categoryRepo.findOneBy({
      id: body.category_id,
    });

    if (!findCategory) throw new HttpException('Category ot found', 400);

    const newNestedCategory = await this.nestedCategoryRepo.create(body);
    await this.nestedCategoryRepo.save(newNestedCategory);

    return { message: 'success', data: newNestedCategory };
  }

  async findAll() {
    const data = await this.nestedCategoryRepo.find({
      relations: ['category'],
    });

    return { message: 'success', data };
  }

  async findOne(id: number) {
    const findNestedCategory = await this.nestedCategoryRepo.findOneBy({ id });

    if (!findNestedCategory)
      throw new HttpException('NestedCategory not found', 400);

    return { message: 'success', data: findNestedCategory };
  }

  async update(id: number, body: UpdateNestedCategoryDto) {
    const findNestedCategory = await this.nestedCategoryRepo.findOneBy({ id });

    if (!findNestedCategory)
      throw new HttpException('NestedCategory not found', 400);

    await this.nestedCategoryRepo.update(id, body);
    return { message: 'success' };
  }

  async remove(id: number) {
    const findNestedCategory = await this.nestedCategoryRepo.findOneBy({ id });

    if (!findNestedCategory)
      throw new HttpException('NestedCategory not found', 400);

    await this.nestedCategoryRepo.delete(id);

    return { message: 'success' };
  }
}
