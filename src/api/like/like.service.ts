import { HttpException, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from 'src/infra/entities/like.entity';
import { LikeRepo } from 'src/infra/repos/like.repo';
import { UserEntity } from 'src/infra/entities/user.entity';
import { UserRepo } from 'src/infra/repos/user.repo';
import { ProductEntity } from 'src/infra/entities/product.entity';
import { ProductRepo } from 'src/infra/repos/product.repo';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity) private readonly likeRepo: LikeRepo,
    @InjectRepository(ProductEntity) private readonly productRepo: ProductRepo,
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepo,
  ) {}
  async create(body: CreateLikeDto) {
    const { user_id, product_id } = body;
    const findUser = await this.userRepo.findOneBy({
      id: user_id,
    });

    const findProduct = await this.productRepo.findOneBy({
      id: product_id,
    });

    if (!findUser) throw new HttpException('User not found', 400);
    if (!findProduct) throw new HttpException('User not found', 400);

    const newLike = await this.likeRepo.create({ product_id, user_id });

    await this.likeRepo.save(newLike);

    return { message: 'success', data: newLike };
  }

  async findAll() {
    const data = await this.likeRepo.find({
      relations: ['user', 'product'],
    });

    return { message: 'Success', data };
  }

  async findOne(id: number) {
    const findLike = await this.likeRepo.findOneBy({ id });

    if (!findLike) throw new HttpException('Like not found', 400);

    return { message: 'Success', data: findLike };
  }

  async remove(id: number) {
    const findLike = await this.likeRepo.findOneBy({ id });

    if (!findLike) throw new HttpException('Like not found', 400);

    await this.likeRepo.delete(id);

    return { message: 'Success' };
  }
}