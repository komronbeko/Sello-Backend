import { Repository } from 'typeorm';
import { UserAddressEntity } from '../entities/user-adress.entity';

export type UserAddressRepo = Repository<UserAddressEntity>;
