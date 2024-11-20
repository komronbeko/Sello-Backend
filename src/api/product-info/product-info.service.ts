import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductInfoDto } from './dto/create-product-info.dto';
import { UpdateProductInfoDto } from './dto/update-product-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductInfoEntity } from 'src/infra/entities/product-info.entity';
import { ProductInfoRepo } from 'src/infra/repos/product-info.repo';
import { ProductRepo } from 'src/infra/repos/product.repo';
import { ProductEntity } from 'src/infra/entities/product.entity';

@Injectable()
export class ProductInfoService {
  constructor(
    @InjectRepository(ProductInfoEntity)
    private readonly productInfoRepo: ProductInfoRepo,
    @InjectRepository(ProductEntity)
    private readonly productRepo: ProductRepo,
  ) {}

  async create(body: CreateProductInfoDto) {
    try {
      const findProduct = await this.productRepo.findOneBy({
        id: body.product_id,
      });

      if (!findProduct) throw new HttpException('Product ot found', 400);

      const newProductInfo = await this.productInfoRepo.create(body);
      await this.productInfoRepo.save(newProductInfo);

      return { message: 'success', data: newProductInfo };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.productInfoRepo.find({
        relations: ['product.discount'],
      });

      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async infosForProduct(product_id: string) {
    try {
      const findProductInfos = await this.productInfoRepo.findBy({
        product_id,
      });

      return { message: 'success', data: findProductInfos };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(id: string, body: UpdateProductInfoDto) {
    try {
      const findProductInfo = await this.productInfoRepo.findOneBy({ id });

      if (!findProductInfo)
        throw new HttpException('ProductInfo not found', 400);

      await this.productInfoRepo.update(id, body);
      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: string) {
    try {
      const findProductInfo = await this.productInfoRepo.findOneBy({ id });

      if (!findProductInfo)
        throw new HttpException('ProductInfo not found', 400);

      await this.productInfoRepo.delete(id);

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
