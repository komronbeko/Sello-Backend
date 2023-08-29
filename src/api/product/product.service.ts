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
    const {
      catalog_id,
      category_id,
      discount_id,
      nested_category_id,
      brand_id,
    } = body;

    const findCatalog = await this.catalogRepo.findOneBy({ id: catalog_id });
    const findBrand = await this.brandRepo.findOneBy({ id: brand_id });
    const findCategory = await this.categoryRepo.findOneBy({ id: category_id });
    const findNestedCategory = await this.nestedCategoryRepo.findOneBy({
      id: nested_category_id,
    });
    const findDiscount = await this.discountRepo.findOneBy({ id: discount_id });

    if (
      !findCatalog ||
      !findCategory ||
      !findNestedCategory ||
      !findDiscount ||
      !findBrand
    ) {
      throw new HttpException('IDs do not exist. Check the IDs first!', 400);
    }

    const newProduct = await this.productRepo.create(body);
    await this.productRepo.save(newProduct);
    return { message: 'success', data: newProduct };
  }

  async findAll() {
    const data = await this.productRepo.find({
      relations: [
        'discount',
        'category',
        'nested_category',
        'brand',
        'catalog',
        'product_infos',
      ],
    });

    return { message: 'success', data };
  }

  async findOne(id: number) {
    const findProduct = await this.productRepo.findOneBy({ id });

    if (!findProduct) throw new HttpException('Product not found', 400);

    return { message: 'success', data: findProduct };
  }

  async update(id: number, body: UpdateProductDto) {
    const findProduct = await this.productRepo.findOneBy({ id });

    if (!findProduct) throw new HttpException('Product not found', 400);

    await this.productRepo.update(id, body);
    return { message: 'success' };
  }

  async remove(id: number) {
    const findProduct = await this.productRepo.findOneBy({ id });

    if (!findProduct) throw new HttpException('Product not found', 400);

    await this.productRepo.delete(id);

    return { message: 'success' };
  }
}
