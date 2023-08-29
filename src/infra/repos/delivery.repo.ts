/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { DeliveryEntity } from '../entities/delivery.entity';

export type DeliveryRepo = Repository<DeliveryEntity>;
