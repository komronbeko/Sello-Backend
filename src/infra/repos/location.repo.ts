import { Repository } from 'typeorm';
import { LocationEntity } from '../entities/location.entity';

export type LocationRepo = Repository<LocationEntity>;
