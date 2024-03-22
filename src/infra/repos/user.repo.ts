import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

export type UserRepo = Repository<UserEntity>;
