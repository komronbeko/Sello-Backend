import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddressEntity } from 'src/infra/entities/user-adress.entity';
import { UserAddressRepo } from 'src/infra/repos/user-address.repo';
import { UserRepo } from 'src/infra/repos/user.repo';
import { UserEntity } from 'src/infra/entities/user.entity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddressEntity)
    private readonly userAddressRepo: UserAddressRepo,
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepo,
  ) {}

  async create(body: CreateUserAddressDto) {
    const findUser = await this.userRepo.findOneBy({
      id: body.user_id,
    });

    if (!findUser) throw new HttpException('User ot found', 400);

    const newUserAddress = await this.userAddressRepo.create(body);
    await this.userAddressRepo.save(newUserAddress);

    return { message: 'success', data: newUserAddress };
  }

  async findAll() {
    const data = await this.userAddressRepo.find({ relations: ['user'] });

    return { message: 'success', data };
  }

  async findOne(id: number) {
    const findUserAddress = await this.userAddressRepo.findOneBy({ id });

    if (!findUserAddress) throw new HttpException('UserAddress not found', 400);

    return { message: 'success', data: findUserAddress };
  }

  async update(id: number, body: UpdateUserAddressDto) {
    const findUserAddress = await this.userAddressRepo.findOneBy({ id });

    if (!findUserAddress) throw new HttpException('UserAddress not found', 400);

    await this.userAddressRepo.update(id, body);
    return { message: 'success' };
  }

  async remove(id: number) {
    const findUserAddress = await this.userAddressRepo.findOneBy({ id });

    if (!findUserAddress) throw new HttpException('UserAddress not found', 400);

    await this.userAddressRepo.delete(id);

    return { message: 'success' };
  }
}
