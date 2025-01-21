import { Repository } from 'typeorm';
import { ProductHistoryEntity } from '../entities/product-history.entity';

export type ProductHistoryRepo = Repository<ProductHistoryEntity>;
