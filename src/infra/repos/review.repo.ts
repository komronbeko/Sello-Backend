/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { ReviewEntity } from '../entities/review.entity';

export type ReviewRepo = Repository<ReviewEntity>;