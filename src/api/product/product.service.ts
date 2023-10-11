/* eslint-disable prettier/prettier */
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

  async sort(value: string, catalog_id: number, category_id: number) {
    try {
      if (!catalog_id) {
        if (value === 'default') {
          
          const data = await this.productRepo.find({
            relations: [
              'discount',
              'catalog',
              'category',
              'product_infos',
              'brand',
              'nested_category'
            ],
          });


          return { message: 'success', data, value };
        } else if (value === 'a-z') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'ASC')
            .addOrderBy('product.name', 'ASC')
            .getMany();
          return { message: 'success', data };
        } else if (value === 'z-a') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'DESC')
            .addOrderBy('product.name', 'DESC')
            .getMany();
          return { message: 'success', data };
        } else if (value === 'discount-top') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'DESC')
            .addOrderBy('discount.rate', 'DESC')
            .getMany();
          return { message: 'success', data };
        } else if (value === 'discount-bottom') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('discount.rate', 'ASC')
            .getMany();
          return { message: 'success', data };
        } else if (value === 'price-top') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('price', 'DESC')
            .getMany();
          return { message: 'success', data };
        } else if (value === 'price-bottom') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('price', 'ASC')
            .getMany();
          return { message: 'success', data };
        } else if (value === 'update-top') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('product.updated_at', 'DESC')
            .getMany();
          return { message: 'success', data };
        } else if (value === 'update-bottom') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('product.updated_at', 'ASC')
            .getMany();
          return { message: 'success', data };
        }
      } 
      else if (!category_id) {
        if (value === 'default') {

          const data = await this.productRepo.find({
            relations: [
              'discount',
              'catalog',
              'category',
              'product_infos',
              'brand',
              'nested_category'
            ],
            where: { catalog_id },
          });

          return { message: 'success', data, catalog_id };
        } else if (value === 'a-z') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'ASC')
            .addOrderBy('product.name', 'ASC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .getMany();

          return { message: 'success', data };
        } else if (value === 'z-a') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'DESC')
            .addOrderBy('product.name', 'DESC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .getMany();
          return { message: 'success', data };
        } else if (value === 'discount-top') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'DESC')
            .addOrderBy('discount.rate', 'DESC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .getMany();
          return { message: 'success', data };
        } else if (value === 'discount-bottom') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('discount.rate', 'ASC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .getMany();
          return { message: 'success', data };
        } else if (value === 'price-top') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('price', 'DESC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .getMany();
          return { message: 'success', data };
        } else if (value === 'price-bottom') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('price', 'ASC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .getMany();
          return { message: 'success', data };
        } else if (value === 'update-top') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('product.updated_at', 'DESC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .getMany();
          return { message: 'success', data };
        } else if (value === 'update-bottom') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('product.updated_at', 'ASC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .getMany();
          return { message: 'success', data };
        }
      }  
      else {
        if (value === 'default') {
          const data = await this.productRepo.find({
            relations: [
              'discount',
              'catalog',
              'category',
              'product_infos',
              'brand',
              'nested_category'
            ],
            where: { catalog_id, category_id },
          });

          return { message: 'success', data };
        } else if (value === 'a-z') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'ASC')
            .addOrderBy('product.name', 'ASC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .andWhere('product.category_id = :category_id', {
              category_id: category_id,
            })
            .getMany();

          return { message: 'success', data };
        } else if (value === 'z-a') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'DESC')
            .addOrderBy('product.name', 'DESC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .andWhere('product.category_id = :category_id', {
              category_id: category_id,
            })
            .getMany();
          return { message: 'success', data };
        } else if (value === 'discount-top') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'DESC')
            .addOrderBy('discount.rate', 'DESC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .andWhere('product.category_id = :category_id', {
              category_id: category_id,
            })
            .getMany();
          return { message: 'success', data };
        } else if (value === 'discount-bottom') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('discount.rate', 'ASC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .andWhere('product.category_id = :category_id', {
              category_id: category_id,
            })
            .getMany();
          return { message: 'success', data };
        } else if (value === 'price-top') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('price', 'DESC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .andWhere('product.category_id = :category_id', {
              category_id: category_id,
            })
            .getMany();
          return { message: 'success', data };
        } else if (value === 'price-bottom') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('price', 'ASC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .andWhere('product.category_id = :category_id', {
              category_id: category_id,
            })
            .getMany();
          return { message: 'success', data };
        } else if (value === 'update-top') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('product.updated_at', 'DESC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .andWhere('product.category_id = :category_id', {
              category_id: category_id,
            })
            .getMany();
          return { message: 'success', data };
        } else if (value === 'update-bottom') {
          const data = await this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.discount', 'discount')
            .leftJoinAndSelect('product.catalog', 'catalog')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.product_infos', 'product_infos')
            .leftJoinAndSelect('product.brand', 'brand')
            .addOrderBy('product.updated_at', 'ASC')
            .where('product.catalog_id = :id', {
              id: catalog_id,
            })
            .andWhere('product.category_id = :category_id', {
              category_id: category_id,
            })
            .getMany();
          return { message: 'success', data };
        }
      }
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
