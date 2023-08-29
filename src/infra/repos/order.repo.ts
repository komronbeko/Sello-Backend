/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';

export type OrderRepo = Repository<OrderEntity>;
