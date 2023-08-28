/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { PartnerEntity } from '../entities/partner.entity';

export type PartnerRepo = Repository<PartnerEntity>;
