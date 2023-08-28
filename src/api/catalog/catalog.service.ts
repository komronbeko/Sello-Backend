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
    const newCatalog = await this.catalogRepo.create(body);
    await this.catalogRepo.save(newCatalog);
    return { message: 'success', data: newCatalog };
  }

  async findAll() {
    const data = await this.catalogRepo.find({
      relations: ['banners', 'categories'],
    });

    return { message: 'success', data };
  }

  async findOne(id: number) {
    const findCatalog = await this.catalogRepo.findOneBy({ id });

    if (!findCatalog) throw new HttpException('Catalog not found', 400);

    return { message: 'success', data: findCatalog };
  }

  async update(id: number, body: UpdateCatalogDto) {
    const findCatalog = await this.catalogRepo.findOneBy({ id });

    if (!findCatalog) throw new HttpException('Catalog not found', 400);

    await this.catalogRepo.update(id, body);
    return { message: 'success' };
  }

  async remove(id: number) {
    const findCatalog = await this.catalogRepo.findOneBy({ id });

    if (!findCatalog) throw new HttpException('Catalog not found', 400);

    await this.catalogRepo.delete(id);

    return { message: 'success' };
  }
}
