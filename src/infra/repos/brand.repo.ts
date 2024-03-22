import { Repository } from 'typeorm';
import { BrandEntity } from '../entities/brand.entity';

export type BrandRepo = Repository<BrandEntity>;
