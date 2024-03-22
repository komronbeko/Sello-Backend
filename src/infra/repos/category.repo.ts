import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';

export type CategoryRepo = Repository<CategoryEntity>;
