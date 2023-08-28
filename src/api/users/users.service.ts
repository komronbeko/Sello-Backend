import { HttpException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/infra/entities/user.entity';
import { UserRepo } from 'src/infra/repos/user.repo';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: UserRepo,
  ) {}
  async findAll() {
    const data = await this.userRepo.find();
    return { message: 'success', data };
  }

  async findOne(id: number) {
    const findUser = await this.userRepo.findOneBy({ id });

    if (!findUser) throw new HttpException('User not found', 400);

    return { message: 'success', data: findUser };
  }

  async update(id: number, body: UpdateUserDto) {
    const findUser = await this.userRepo.findOneBy({ id });

    if (!findUser) throw new HttpException('User not found', 400);

    await this.userRepo.update(id, body);
    return `This action updates a #${id} user`;
  }
}
