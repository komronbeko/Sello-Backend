/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';

export type CartRepo = Repository<CartEntity>;
