/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { CatalogEntity } from '../entities/catalog.entity';

export type CatalogRepo = Repository<CatalogEntity>;
