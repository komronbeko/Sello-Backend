import { Repository } from 'typeorm';
import { LikeEntity } from '../entities/like.entity';

export type LikeRepo = Repository<LikeEntity>;
