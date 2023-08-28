/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';

export type ProductRepo = Repository<ProductEntity>;
