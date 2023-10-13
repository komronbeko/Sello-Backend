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

  async sort(
    value: string,
    catalog_id: number,
    category_id: number,
    from: number,
    to: number,
    discounts_arr: number[],
    brands_arr: string[],
    sub_categories_arr: string[],
    product_infos_arr: string[],
  ) {
    try {
      //---------------ALL-FILTERS--------------//
      //----------------------------------------//
      if (
        product_infos_arr.length &&
        sub_categories_arr.length &&
        brands_arr.length &&
        discounts_arr.length &&
        to &&
        from &&
        category_id &&
        catalog_id &&
        value
      ) {
        switch (value) {
          case 'default':
            const data1 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .andWhere(
                'EXISTS ' +
                  '(SELECT 1 FROM product_infos AS info ' +
                  'WHERE info.product_id = product.id ' +
                  'AND info.value IN (:...productInfoValues))',
                { productInfoValues: product_infos_arr },
              )
              .getMany();

            return { message: 'success', data1 };
          case 'a-z':
            const data2 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .andWhere(
                'EXISTS ' +
                  '(SELECT 1 FROM product_infos AS info ' +
                  'WHERE info.product_id = product.id ' +
                  'AND info.value IN (:...productInfoValues))',
                { productInfoValues: product_infos_arr },
              )
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'ASC')
              .addOrderBy('product.name', 'ASC')
              .getMany();

            return { message: 'success', data2 };
          case 'z-a':
            const data3 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .andWhere(
                'EXISTS ' +
                  '(SELECT 1 FROM product_infos AS info ' +
                  'WHERE info.product_id = product.id ' +
                  'AND info.value IN (:...productInfoValues))',
                { productInfoValues: product_infos_arr },
              )
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'DESC')
              .addOrderBy('product.name', 'DESC')
              .getMany();

            return { message: 'success', data3 };
          case 'discount-top':
            const data4 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .andWhere(
                'EXISTS ' +
                  '(SELECT 1 FROM product_infos AS info ' +
                  'WHERE info.product_id = product.id ' +
                  'AND info.value IN (:...productInfoValues))',
                { productInfoValues: product_infos_arr },
              )
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'DESC')
              .addOrderBy('discount.rate', 'DESC')
              .getMany();

            return { message: 'success', data4 };
          case 'discount-bottom':
            const data5 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .andWhere(
                'EXISTS ' +
                  '(SELECT 1 FROM product_infos AS info ' +
                  'WHERE info.product_id = product.id ' +
                  'AND info.value IN (:...productInfoValues))',
                { productInfoValues: product_infos_arr },
              )
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'ASC')
              .addOrderBy('discount.rate', 'ASC')
              .getMany();

            return { message: 'success', data5 };
          case 'price-top':
            const data6 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .andWhere(
                'EXISTS ' +
                  '(SELECT 1 FROM product_infos AS info ' +
                  'WHERE info.product_id = product.id ' +
                  'AND info.value IN (:...productInfoValues))',
                { productInfoValues: product_infos_arr },
              )
              .orderBy('price', 'DESC')
              .getMany();

            return { message: 'success', data6 };
          case 'price-bottom':
            const data7 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .andWhere(
                'EXISTS ' +
                  '(SELECT 1 FROM product_infos AS info ' +
                  'WHERE info.product_id = product.id ' +
                  'AND info.value IN (:...productInfoValues))',
                { productInfoValues: product_infos_arr },
              )
              .orderBy('price', 'ASC')
              .getMany();

            return { message: 'success', data7 };
          case 'update-top':
            const data8 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .andWhere(
                'EXISTS ' +
                  '(SELECT 1 FROM product_infos AS info ' +
                  'WHERE info.product_id = product.id ' +
                  'AND info.value IN (:...productInfoValues))',
                { productInfoValues: product_infos_arr },
              )
              .orderBy('product.updated_at', 'DESC')
              .getMany();

            return { message: 'success', data8 };
          case 'update-bottom':
            const data9 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .andWhere(
                'EXISTS ' +
                  '(SELECT 1 FROM product_infos AS info ' +
                  'WHERE info.product_id = product.id ' +
                  'AND info.value IN (:...productInfoValues))',
                { productInfoValues: product_infos_arr },
              )
              .orderBy('product.updated_at', 'ASC')
              .getMany();

            return { message: 'success', data9 };
        }
      }

      //---------------ALL-FILTERS EXCEPT PRODUCT_INFOS--------------//
      //------------------------------------------------------------//
      if (
        sub_categories_arr.length &&
        brands_arr.length &&
        discounts_arr.length &&
        to &&
        from &&
        category_id &&
        catalog_id &&
        value
      ) {
        switch (value) {
          case 'default':
            const data1 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .getMany();

            return { message: 'success', data1 };
          case 'a-z':
            const data2 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'ASC')
              .addOrderBy('product.name', 'ASC')
              .getMany();

            return { message: 'success', data2 };
          case 'z-a':
            const data3 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'DESC')
              .addOrderBy('product.name', 'DESC')
              .getMany();

            return { message: 'success', data3 };
          case 'discount-top':
            const data4 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'DESC')
              .addOrderBy('discount.rate', 'DESC')
              .getMany();

            return { message: 'success', data4 };
          case 'discount-bottom':
            const data5 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'ASC')
              .addOrderBy('discount.rate', 'ASC')
              .getMany();

            return { message: 'success', data5 };
          case 'price-top':
            const data6 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('price', 'DESC')
              .getMany();

            return { message: 'success', data6 };
          case 'price-bottom':
            const data7 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('price', 'ASC')
              .getMany();

            return { message: 'success', data7 };
          case 'update-top':
            const data8 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('product.updated_at', 'DESC')
              .getMany();

            return { message: 'success', data8 };
          case 'update-bottom':
            const data9 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('nested_category.name IN (:...subCategoriesArr)', {
                subCategoriesArr: sub_categories_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('product.updated_at', 'ASC')
              .getMany();

            return { message: 'success', data9 };
        }
      }

      //---------------ALL-FILTERS EXCEPT PRODUCT_INFOS and SUB_CATEGORIES--------------//
      //------------------------------------------------------------//
      if (
        brands_arr.length &&
        discounts_arr.length &&
        to &&
        from &&
        category_id &&
        catalog_id &&
        value
      ) {
        switch (value) {
          case 'default':
            const data1 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .getMany();

            return { message: 'success', data1 };
          case 'a-z':
            const data2 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'ASC')
              .addOrderBy('product.name', 'ASC')
              .getMany();

            return { message: 'success', data2 };
          case 'z-a':
            const data3 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'DESC')
              .addOrderBy('product.name', 'DESC')
              .getMany();

            return { message: 'success', data3 };
          case 'discount-top':
            const data4 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'DESC')
              .addOrderBy('discount.rate', 'DESC')
              .getMany();

            return { message: 'success', data4 };
          case 'discount-bottom':
            const data5 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'ASC')
              .addOrderBy('discount.rate', 'ASC')
              .getMany();

            return { message: 'success', data5 };
          case 'price-top':
            const data6 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('price', 'DESC')
              .getMany();

            return { message: 'success', data6 };
          case 'price-bottom':
            const data7 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('price', 'ASC')
              .getMany();

            return { message: 'success', data7 };
          case 'update-top':
            const data8 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('product.updated_at', 'DESC')
              .getMany();

            return { message: 'success', data8 };
          case 'update-bottom':
            const data9 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .andWhere('brand.name IN (:...brandsArr)', {
                brandsArr: brands_arr,
              })
              .orderBy('product.updated_at', 'ASC')
              .getMany();

            return { message: 'success', data9 };
        }
      }

      //---------------ALL-FILTERS EXCEPT PRODUCT_INFOS, SUB_CATEGORIES and BRANDS--------------//
      //------------------------------------------------------------//
      if (
        discounts_arr.length &&
        to &&
        from &&
        category_id &&
        catalog_id &&
        value
      ) {
        switch (value) {
          case 'default':
            const data1 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .getMany();

            return { message: 'success', data1 };
          case 'a-z':
            const data2 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'ASC')
              .addOrderBy('product.name', 'ASC')
              .getMany();

            return { message: 'success', data2 };
          case 'z-a':
            const data3 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'DESC')
              .addOrderBy('product.name', 'DESC')
              .getMany();

            return { message: 'success', data3 };
          case 'discount-top':
            const data4 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'DESC')
              .addOrderBy('discount.rate', 'DESC')
              .getMany();

            return { message: 'success', data4 };
          case 'discount-bottom':
            const data5 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'ASC')
              .addOrderBy('discount.rate', 'ASC')
              .getMany();

            return { message: 'success', data5 };
          case 'price-top':
            const data6 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .orderBy('price', 'DESC')
              .getMany();

            return { message: 'success', data6 };
          case 'price-bottom':
            const data7 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .orderBy('price', 'ASC')
              .getMany();

            return { message: 'success', data7 };
          case 'update-top':
            const data8 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .orderBy('product.updated_at', 'DESC')
              .getMany();

            return { message: 'success', data8 };
          case 'update-bottom':
            const data9 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .andWhere('discount.rate IN (:...discountArr)', {
                discountArr: discounts_arr,
              })
              .orderBy('product.updated_at', 'ASC')
              .getMany();

            return { message: 'success', data9 };
        }
      }

      //---------------PRICE, CATEGORY, CATALOG, SORTING_VALUE FILTERS--------------//
      //---------------------------------------------------------------------------//
      if (to && from && category_id && catalog_id && value) {
        switch (value) {
          case 'default':
            const data1 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .getMany();

            return { message: 'success', data1 };
          case 'a-z':
            const data2 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'ASC')
              .addOrderBy('product.name', 'ASC')
              .getMany();

            return { message: 'success', data2 };
          case 'z-a':
            const data3 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'DESC')
              .addOrderBy('product.name', 'DESC')
              .getMany();

            return { message: 'success', data3 };
          case 'discount-top':
            const data4 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'DESC')
              .addOrderBy('discount.rate', 'DESC')
              .getMany();

            return { message: 'success', data4 };
          case 'discount-bottom':
            const data5 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'ASC')
              .addOrderBy('discount.rate', 'ASC')
              .getMany();

            return { message: 'success', data5 };
          case 'price-top':
            const data6 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .orderBy('price', 'DESC')
              .getMany();

            return { message: 'success', data6 };
          case 'price-bottom':
            const data7 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .orderBy('price', 'ASC')
              .getMany();

            return { message: 'success', data7 };
          case 'update-top':
            const data8 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .orderBy('product.updated_at', 'DESC')
              .getMany();

            return { message: 'success', data8 };
          case 'update-bottom':
            const data9 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .andWhere('product.price BETWEEN :from AND :to', { from, to })
              .orderBy('product.updated_at', 'ASC')
              .getMany();

            return { message: 'success', data9 };
        }
      }

      //---------------CATEGORY, CATALOG, SORTING_VALUE FILTERS--------------//
      //----------------------------------------------------------------------------//
      if (category_id && catalog_id && value) {
        switch (value) {
          case 'default':
            const data1 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .getMany();

            return { message: 'success', data1 };
          case 'a-z':
            const data2 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'ASC')
              .addOrderBy('product.name', 'ASC')
              .getMany();

            return { message: 'success', data2 };
          case 'z-a':
            const data3 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'DESC')
              .addOrderBy('product.name', 'DESC')
              .getMany();

            return { message: 'success', data3 };
          case 'discount-top':
            const data4 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'DESC')
              .addOrderBy('discount.rate', 'DESC')
              .getMany();

            return { message: 'success', data4 };
          case 'discount-bottom':
            const data5 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'ASC')
              .addOrderBy('discount.rate', 'ASC')
              .getMany();

            return { message: 'success', data5 };
          case 'price-top':
            const data6 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .orderBy('price', 'DESC')
              .getMany();

            return { message: 'success', data6 };
          case 'price-bottom':
            const data7 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .orderBy('price', 'ASC')
              .getMany();

            return { message: 'success', data7 };
          case 'update-top':
            const data8 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .orderBy('product.updated_at', 'DESC')
              .getMany();

            return { message: 'success', data8 };
          case 'update-bottom':
            const data9 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .andWhere('product.category_id = :category_id', { category_id })
              .orderBy('product.updated_at', 'ASC')
              .getMany();

            return { message: 'success', data9 };
        }
      }

      //---------------CATALOG and SORTING_VALUE FILTERS--------------//
      //----------------------------------------------------------------------------//
      if (catalog_id && value) {
        switch (value) {
          case 'default':
            const data1 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .getMany();

            return { message: 'success', data1 };
          case 'a-z':
            const data2 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'ASC')
              .addOrderBy('product.name', 'ASC')
              .getMany();

            return { message: 'success', data2 };
          case 'z-a':
            const data3 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'DESC')
              .addOrderBy('product.name', 'DESC')
              .getMany();

            return { message: 'success', data3 };
          case 'discount-top':
            const data4 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'DESC')
              .addOrderBy('discount.rate', 'DESC')
              .getMany();

            return { message: 'success', data4 };
          case 'discount-bottom':
            const data5 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'ASC')
              .addOrderBy('discount.rate', 'ASC')
              .getMany();

            return { message: 'success', data5 };
          case 'price-top':
            const data6 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .orderBy('price', 'DESC')
              .getMany();

            return { message: 'success', data6 };
          case 'price-bottom':
            const data7 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .orderBy('price', 'ASC')
              .getMany();

            return { message: 'success', data7 };
          case 'update-top':
            const data8 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .orderBy('product.updated_at', 'DESC')
              .getMany();

            return { message: 'success', data8 };
          case 'update-bottom':
            const data9 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .where('product.catalog_id = :catalog_id', { catalog_id })
              .orderBy('product.updated_at', 'ASC')
              .getMany();

            return { message: 'success', data9 };
        }
      }

      //---------------FILTER BY SORTING_VALUE--------------//
      //----------------------------------------------------------------------------//
      if (value) {
        switch (value) {
          case 'default':
            const data = await this.productRepo.find({
              relations: [
                'discount',
                'catalog',
                'category',
                'product_infos',
                'brand',
                'nested_category',
              ],
            });

            return { message: 'success', data };
          case 'a-z':
            const data2 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'ASC')
              .addOrderBy('product.name', 'ASC')
              .getMany();

            // const data = await this.productRepo
            // .createQueryBuilder('product')
            // .leftJoinAndSelect('product.discount', 'discount')
            // .leftJoinAndSelect('product.catalog', 'catalog')
            // .leftJoinAndSelect('product.category', 'category')
            // .leftJoinAndSelect('product.product_infos', 'product_infos')
            // .leftJoinAndSelect('product.brand', 'brand')
            // .leftJoinAndSelect('product.nested_category', 'nested_category')
            // .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'ASC')
            // .addOrderBy('product.name', 'ASC')
            // .getMany();

            return { message: 'success', data2 };
          case 'z-a':
            const data3 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .orderBy('SUBSTRING(product.name FROM 1 FOR 1)', 'DESC')
              .addOrderBy('product.name', 'DESC')
              .getMany();

            return { message: 'success', data3 };
          case 'discount-top':
            const data4 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'DESC')
              .addOrderBy('discount.rate', 'DESC')
              .getMany();

            return { message: 'success', data4 };
          case 'discount-bottom':
            const data5 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .orderBy('CASE WHEN discount IS NULL THEN 0 ELSE 1 END', 'ASC')
              .addOrderBy('discount.rate', 'ASC')
              .getMany();

            return { message: 'success', data5 };
          case 'price-top':
            const data6 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .orderBy('price', 'DESC')
              .getMany();

            return { message: 'success', data6 };
          case 'price-bottom':
            const data7 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .orderBy('price', 'ASC')
              .getMany();

            return { message: 'success', data7 };
          case 'update-top':
            const data8 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .orderBy('product.updated_at', 'DESC')
              .getMany();

            return { message: 'success', data8 };
          case 'update-bottom':
            const data9 = await this.productRepo
              .createQueryBuilder('product')
              .leftJoinAndSelect('product.catalog', 'catalog')
              .leftJoinAndSelect('product.category', 'category')
              .leftJoinAndSelect('product.product_infos', 'product_info')
              .leftJoinAndSelect('product.brand', 'brand')
              .leftJoinAndSelect('product.nested_category', 'nested_category')
              .leftJoinAndSelect('product.discount', 'discount')
              .orderBy('product.updated_at', 'ASC')
              .getMany();

            return { message: 'success', data9 };
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
