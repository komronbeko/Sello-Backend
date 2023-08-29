/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { PostamatEntity } from '../entities/postamat.entity';

export type PostamatRepo = Repository<PostamatEntity>;
