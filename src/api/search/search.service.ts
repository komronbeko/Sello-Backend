/* eslint-disable prettier/prettier */
// import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/infra/entities/product.entity';
import { ProductRepo } from 'src/infra/repos/product.repo';
import { Brackets } from 'typeorm';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';

// @Injectable()
export class SearchService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepo: ProductRepo,
  ) {
    // @Inject(CACHE_MANAGER) private cacheService: Cache,
  }

  async search(searchValue: string): Promise<ProductEntity[] | string> {
    // const cachedData =
    //   await this.cacheService.get<ProductEntity[]>(searchValue);

    // if (cachedData) {
    //   return cachedData;
    // }

    const searchedProducts = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.nested_category', 'nested_category')
      .leftJoinAndSelect('product.catalog', 'catalog')
      .leftJoinAndSelect('product.product_infos', 'product_infos')
      .where('product.is_deleted = false') // Note: Prefixed with 'product' to avoid ambiguity
      .andWhere(
        new Brackets((qb) => {
          qb.where('product.name ILIKE :name', { name: `%${searchValue}%` })
            .orWhere('product.description ILIKE :description', {
              description: `%${searchValue}%`,
            })
            .orWhere('category.name ILIKE :categoryName', {
              categoryName: `%${searchValue}%`,
            })
            .orWhere('nested_category.name ILIKE :nesCatName', {
              nesCatName: `%${searchValue}%`,
            })
            .orWhere('catalog.name ILIKE :catalogName', {
              catalogName: `%${searchValue}%`,
            })
            .orWhere('product_infos.value ILIKE :infoValue', {
              infoValue: `%${searchValue}%`,
            });
        }),
      )
      .getMany();

    // if (searchedProducts.length) {
    //   await this.cacheService.set(searchValue, searchedProducts);
    // }
    return searchedProducts;
  }
}
