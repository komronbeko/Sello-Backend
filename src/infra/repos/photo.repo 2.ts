import { Repository } from 'typeorm';
import { PhotoEntity } from '../entities/photo.entity';

export type photoRepo = Repository<PhotoEntity>;
