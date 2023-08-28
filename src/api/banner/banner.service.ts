import { HttpException, Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerEntity } from 'src/infra/entities/banner.entity';
import { BannerRepo } from 'src/infra/repos/banner.repo';
import { CatalogEntity } from 'src/infra/entities/catalog.entity';
import { CatalogRepo } from 'src/infra/repos/catalog.repo';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity) private readonly bannerRepo: BannerRepo,
    @InjectRepository(CatalogEntity)
    private readonly catalogRepo: CatalogRepo,
  ) {}
  async create(body: CreateBannerDto) {
    const findCatalog = await this.catalogRepo.findOneBy({
      id: body.catalog_id,
    });

    if (!findCatalog) throw new HttpException('Catalog not found', 400);
    const newBanner = await this.bannerRepo.create(body);

    await this.bannerRepo.save(newBanner);

    return { message: 'success', data: newBanner };
  }

  async findAll() {
    const data = await this.bannerRepo.find({ relations: ['catalog'] });

    return { message: 'Success', data };
  }

  async findOne(id: number) {
    const findBanner = await this.bannerRepo.findOneBy({ id });

    if (!findBanner) throw new HttpException('Banner not found', 400);

    return { message: 'Success', data: findBanner };
  }

  async update(id: number, body: UpdateBannerDto) {
    const findBanner = await this.bannerRepo.findOneBy({ id });

    if (!findBanner) throw new HttpException('Banner not found', 400);

    await this.bannerRepo.update(id, body);

    return { message: 'Success' };
  }

  async remove(id: number) {
    const findBanner = await this.bannerRepo.findOneBy({ id });

    if (!findBanner) throw new HttpException('Banner not found', 400);

    await this.bannerRepo.delete(id);

    return { message: 'Success' };
  }
}
