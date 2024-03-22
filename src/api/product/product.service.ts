import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/infra/entities/product.entity';
import { ProductRepo } from 'src/infra/repos/product.repo';
import { CatalogEntity } from 'src/infra/entities/catalog.entity';
import { CatalogRepo } from 'src/infra/repos/catalog.repo';
import { CategoryEntity } from 'src/infra/entities/category.entity';
import { CategoryRepo } from 'src/infra/repos/category.repo';
import { DiscountEntity } from 'src/infra/entities/discount.entity';
import { DiscountRepo } from 'src/infra/repos/discount.repo';
import { NestedCategoryEntity } from 'src/infra/entities/nested-category.entity';
import { NestedCategoryRepo } from 'src/infra/repos/nested-category.repo';
import { BrandRepo } from 'src/infra/repos/brand.repo';
import { BrandEntity } from 'src/infra/entities/brand.entity';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepo: ProductRepo,
    @InjectRepository(CatalogEntity) private readonly catalogRepo: CatalogRepo,
    @InjectRepository(BrandEntity) private readonly brandRepo: BrandRepo,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: CategoryRepo,
    @InjectRepository(DiscountEntity)
    private readonly discountRepo: DiscountRepo,
    @InjectRepository(NestedCategoryEntity)
    private readonly nestedCategoryRepo: NestedCategoryRepo,
  ) {}
  async create(body: CreateProductDto) {
    try {
      const { catalog_id, category_id, nested_category_id, brand_id } = body;

      const findCatalog = await this.catalogRepo.findOneBy({ id: catalog_id });
      const findBrand = await this.brandRepo.findOneBy({ id: brand_id });
      const findCategory = await this.categoryRepo.findOneBy({
        id: category_id,
      });
      const findNestedCategory = await this.nestedCategoryRepo.findOneBy({
        id: nested_category_id,
      });

      if (!findCatalog || !findCategory || !findNestedCategory || !findBrand) {
        throw new HttpException('IDs do not exist. Check the IDs first!', 400);
      }

      const newProduct = await this.productRepo.create(body);
      await this.productRepo.save(newProduct);
      return { message: 'success', data: newProduct };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.productRepo.find({
        relations: [
          'discount',
          'category',
          'nested_category',
          'brand',
          'catalog',
          'product_infos',
          'likes',
          'carts',
        ],
      });

      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOne(id: number) {
    try {
      const findProduct = await this.productRepo.findOne({
        where: { id },
        relations: [
          'discount',
          'category',
          'nested_category',
          'brand',
          'catalog',
          'product_infos',
        ],
      } as FindOneOptions);

      if (!findProduct) throw new HttpException('Product not found', 400);

      return { message: 'success', data: findProduct };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async sort(
    value: string,
    catalog_id: number,
    category_id: number,
    from: number,
    to: number,
    discounts_arr: string,
    brands_arr: string,
    sub_categories_arr: string,
    product_infos_arr: string,
  ) {
    try {
      let query = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.catalog', 'catalog')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.product_infos', 'product_info')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.nested_category', 'nested_category')
        .leftJoinAndSelect('product.discount', 'discount');

      if (catalog_id) {
        query = query.where('product.catalog_id = :catalog_id', { catalog_id });
      }

      if (category_id) {
        query = query.andWhere('product.category_id = :category_id', {
          category_id,
        });
      }

      if (from && to) {
        query = query.andWhere('product.price BETWEEN :from AND :to', {
          from,
          to,
        });
      }

      if (discounts_arr && JSON.parse(discounts_arr).length) {
        query = query.andWhere('discount.rate IN (:...discountArr)', {
          discountArr: JSON.parse(discounts_arr),
        });
      }

      if (sub_categories_arr && JSON.parse(sub_categories_arr).length) {
        query = query.andWhere(
          'nested_category.name IN (:...subCategoriesArr)',
          { subCategoriesArr: JSON.parse(sub_categories_arr) },
        );
      }

      if (brands_arr && JSON.parse(brands_arr).length) {
        query = query.andWhere('brand.name IN (:...brandsArr)', {
          brandsArr: JSON.parse(brands_arr),
        });
      }

      if (product_infos_arr && JSON.parse(product_infos_arr).length) {
        query = query.andWhere(
          'EXISTS ' +
            '(SELECT 1 FROM product_infos AS info ' +
            'WHERE info.product_id = product.id ' +
            'AND info.value IN (:...productInfoValues))',
          { productInfoValues: JSON.parse(product_infos_arr) },
        );
      }

      switch (value) {
        case 'a-z':
          query = query.orderBy('product.name', 'ASC');
          break;
        case 'z-a':
          query = query.orderBy('product.name', 'DESC');
          break;
        case 'discount-top':
          query = query
            .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'DESC')
            .addOrderBy('discount.rate', 'DESC');
          break;
        case 'discount-bottom':
          query = query
            .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'ASC')
            .addOrderBy('discount.rate', 'ASC');
          break;
        case 'price-top':
          query = query.orderBy('price', 'DESC');
          break;
        case 'price-bottom':
          query = query.orderBy('price', 'ASC');
          break;
        case 'update-top':
          query = query.orderBy('product.updated_at', 'DESC');
          break;
        case 'update-bottom':
          query = query.orderBy('product.updated_at', 'ASC');
          break;
      }

      return { message: 'success', data: await query.getMany() };
    } catch (error) {
      return { message: error.message };
    }
  }

  async update(id: number, body: UpdateProductDto) {
    try {
      const findProduct = await this.productRepo.findOneBy({ id });

      if (!findProduct) throw new HttpException('Product not found', 400);

      await this.productRepo.update(id, body);
      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: number) {
    try {
      const findProduct = await this.productRepo.findOneBy({ id });

      if (!findProduct) throw new HttpException('Product not found', 400);

      await this.productRepo.delete(id);

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
