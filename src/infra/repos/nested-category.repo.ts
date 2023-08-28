/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { NestedCategoryEntity } from '../entities/nested-category.entity';

export type NestedCategoryRepo = Repository<NestedCategoryEntity>;
