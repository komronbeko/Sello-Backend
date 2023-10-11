/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CatalogEntity } from 'src/infra/entities/catalog.entity';
import { CatalogRepo } from 'src/infra/repos/catalog.repo';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(CatalogEntity) private readonly catalogRepo: CatalogRepo,
  ) {}
  async create(body: CreateCatalogDto) {
    try {
      const newCatalog = await this.catalogRepo.create(body);
      await this.catalogRepo.save(newCatalog);
      return { message: 'success', data: newCatalog };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.catalogRepo.find({
        relations: ['banners', 'categories.nestedCategories', 'products'],
      });
      

      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOne(id: number) {
    try {
      const findCatalog = await this.catalogRepo.findOneBy({ id });

      if (!findCatalog) throw new HttpException('Catalog not found', 400);

      return { message: 'success', data: findCatalog };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(id: number, body: UpdateCatalogDto) {
    try {
      const findCatalog = await this.catalogRepo.findOneBy({ id });

      if (!findCatalog) throw new HttpException('Catalog not found', 400);

      await this.catalogRepo.update(id, body);
      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: number) {
    try {
      const findCatalog = await this.catalogRepo.findOneBy({ id });

      if (!findCatalog) throw new HttpException('Catalog not found', 400);

      await this.catalogRepo.delete(id);

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
