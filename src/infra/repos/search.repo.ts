/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { SearchEntity } from '../entities/search.entity';

export type SearchRepo = Repository<SearchEntity>;
