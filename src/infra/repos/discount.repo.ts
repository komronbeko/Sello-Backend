/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { DiscountEntity } from '../entities/discount.entity';

export type DiscountRepo = Repository<DiscountEntity>;
