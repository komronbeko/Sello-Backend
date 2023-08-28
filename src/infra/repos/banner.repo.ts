/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BannerEntity } from '../entities/banner.entity';

export type BannerRepo = Repository<BannerEntity>;
