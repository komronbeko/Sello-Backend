/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { NestedCategoryEntity } from 'src/infra/entities/nested-category.entity';
import { NestedCategoryRepo } from 'src/infra/repos/nested-category.repo';
import { FindOneOptions } from 'typeorm';
import { UserEntity } from 'src/infra/entities/user.entity';
import { UserRepo } from 'src/infra/repos/user.repo';
import { PhotoEntity } from 'src/infra/entities/photo.entity';
import { photoRepo } from 'src/infra/repos/photo.repo';
import { v4 as uuidv4 } from 'uuid';
import { VerifyProdDto } from './dto/verify-product.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepo: ProductRepo,
    @InjectRepository(PhotoEntity) private readonly photoRepo: photoRepo,
    @InjectRepository(CatalogEntity) private readonly catalogRepo: CatalogRepo,
    @InjectRepository(UserEntity) private readonly userRepo: UserRepo,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: CategoryRepo,
    @InjectRepository(NestedCategoryEntity)
    private readonly nestedCategoryRepo: NestedCategoryRepo,
  ) {}

  async create(body: CreateProductDto, user_id: string) {
    try {
      const { catalog_id, category_id, nested_category_id, photoPaths } = body;
      const product_id = uuidv4();

      // Run all validations concurrently
      const [findUser, findCatalog, findCategory, findNestedCategory] =
        await Promise.all([
          this.userRepo.findOneBy({ id: user_id }),
          this.catalogRepo.findOneBy({ id: catalog_id }),
          this.categoryRepo.findOneBy({ id: category_id }),
          this.nestedCategoryRepo.findOneBy({ id: nested_category_id }),
        ]);

      if (!findUser) throw new HttpException('User not found', 400);
      if (!findCatalog) throw new HttpException('Catalog not found', 400);
      if (!findCategory) throw new HttpException('Category not found', 400);
      if (!findNestedCategory)
        throw new HttpException('Nested category not found', 400);

      // Create and save product
      const newProduct = this.productRepo.create({
        ...body,
        user_id,
        id: product_id,
      });
      await this.productRepo.save(newProduct);

      // Create and save photo paths
      const photoData = photoPaths.map((photo) => {
        const photoEntity = new PhotoEntity();
        photoEntity.product_id = product_id;
        photoEntity.path = photo;
        return photoEntity;
      });

      await this.photoRepo.save(photoData);

      // Return success response
      return {
        message: 'success',
        data: { product: newProduct, photos: photoData },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('An unexpected error occurred', 500);
    }
  }

  async findAll({ page, limit }: PaginationDto) {
    try {
      const offset = (page - 1) * limit;
      const [data, total] = await this.productRepo.findAndCount({
        where: { is_verified: true, is_deleted: false },
        relations: [
          'discount',
          'category',
          'nested_category',
          'catalog',
          'product_infos',
          'likes',
          'carts',
          'user',
          'photos',
        ],
        skip: offset,
        take: limit,
      });

      return {
        data,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async userProducts(user_id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: user_id } });

      if (!user) throw new HttpException('User not found', 401);

      const userProducts = await this.productRepo.find({
        where: { user_id, is_deleted: false },
        relations: ['photos'],
      });

      return { message: 'success', data: userProducts };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOne(id: string) {
    try {
      const findProduct = await this.productRepo.findOne({
        where: { id },
        relations: [
          'discount',
          'category',
          'nested_category',
          'catalog',
          'product_infos',
          'user',
          'photos',
        ],
      } as FindOneOptions);

      if (!findProduct) throw new HttpException('Product not found', 400);

      return { message: 'success', data: findProduct };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async getUnverified() {
    try {
      const data = await this.productRepo.find({
        where: { is_verified: false, is_deleted: false },
        relations: [
          'discount',
          'category',
          'nested_category',
          'catalog',
          'product_infos',
          'likes',
          'carts',
          'user',
          'photos',
        ],
      });

      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async verifyProduct(body: VerifyProdDto) {
    try {
      const findProduct = await this.productRepo.findOneBy({
        id: body.product_id,
        is_deleted: false,
      });

      if (!findProduct) throw new HttpException('Product not found', 400);

      await this.productRepo.update(body.product_id, { is_verified: true });

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async fetchDeleted(user_id) {
    try {
      const data = await this.productRepo.find({
        where: { user_id, is_deleted: true },
        relations: ['photos'],
      });
      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async sort(
    value: string,
    catalog_id: string,
    category_id: string,
    from: string,
    to: string,
    discounts_arr: string,
    sub_categories_arr: string,
    product_infos_arr: string,
  ) {
    try {
      let query = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.catalog', 'catalog')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.product_infos', 'product_info')
        .leftJoinAndSelect('product.nested_category', 'nested_category')
        .leftJoinAndSelect('product.discount', 'discount')
        .leftJoinAndSelect('product.photos', 'photos')
        .where('is_verified = true')
        .andWhere('is_deleted = false');

      if (catalog_id) {
        query = query.andWhere('product.catalog_id = :catalog_id', {
          catalog_id,
        });
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

  async update(id: string, body: UpdateProductDto) {
    try {
      const findProduct = await this.productRepo.findOneBy({ id });

      if (!findProduct) throw new HttpException('Product not found', 400);

      await this.productRepo.update(id, body);
      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async softDeleteUserProducts(user_id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: user_id } });
      if (!user) throw new HttpException('User not found', 404);

      const products = await this.productRepo.find({
        where: { user_id, is_deleted: false },
      });

      if (products.length === 0) {
        throw new HttpException('No products found for this user', 404);
      }

      await this.productRepo.update(
        { user_id, is_deleted: false },
        { is_deleted: true },
      );

      return { message: 'Deleted Successfully' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async hardDeleteUserProducts(user_id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: user_id } });
      if (!user) throw new HttpException('User not found', 404);

      const products = await this.productRepo.find({
        where: { user_id, is_deleted: true },
      });

      if (products.length === 0) {
        throw new HttpException('No deleted products found for this user', 404);
      }

      await this.productRepo.delete({ user_id, is_deleted: true });

      return { message: 'Product(s) Hard Deleted Successfully' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async delete(id: string, user_id: string) {
    try {
      const product = await this.productRepo.findOneBy({ id });

      if (!product) throw new HttpException('Product not found', 400);

      await this.productRepo.update(id, { is_deleted: true });

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async restoreProduct(product_id: string) {
    try {
      const findProduct = await this.productRepo.findOne({
        where: { id: product_id },
      });

      if (!findProduct)
        throw new HttpException(
          'Product not found in history or already restored',
          404,
        );

      await this.productRepo.update({ id: product_id }, { is_deleted: false });

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
