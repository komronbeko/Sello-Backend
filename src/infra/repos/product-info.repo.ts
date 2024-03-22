import { Repository } from 'typeorm';
import { ProductInfoEntity } from '../entities/product-info.entity';

export type ProductInfoRepo = Repository<ProductInfoEntity>;
