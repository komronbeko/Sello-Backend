import { HttpException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from 'src/infra/entities/brand.entity';
import { BrandRepo } from 'src/infra/repos/brand.repo';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity) private readonly brandEntity: BrandRepo,
  ) {}
  async create(body: CreateBrandDto) {
    const newBrand = await this.brandEntity.create(body);

    return { message: 'success', newBrand };
  }

  async findAll() {
    const data = await this.brandEntity.find({});

    return { message: 'success', data };
  }

  async findOne(id: number) {
    const finndBrand = await this.brandEntity.findOneBy({ id });

    if (!finndBrand) throw new HttpException('Brand not found', 400);

    return { message: 'success', data: finndBrand };
  }

  async update(id: number, body: UpdateBrandDto) {
    const finndBrand = await this.brandEntity.findOneBy({ id });

    if (!finndBrand) throw new HttpException('Brand not found', 400);

    await this.brandEntity.update(id, body);

    return { message: 'success' };
  }

  async remove(id: number) {
    const finndBrand = await this.brandEntity.findOneBy({ id });

    if (!finndBrand) throw new HttpException('Brand not found', 400);

    await this.brandEntity.delete(id);

    return { message: 'success' };
  }
}
