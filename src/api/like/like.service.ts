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
  async create(body: CreateLikeDto, user_id: string) {
    try {
      const { product_id } = body;

      const findLike = await this.likeRepo.findOneBy({ user_id, product_id });

      if (findLike) {
        await this.likeRepo.delete({ product_id, user_id });
        return { message: 'Success' };
      }

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
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.likeRepo.find({
        relations: ['user', 'product.discount', 'product.photos'],
      });

      return { message: 'Success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async getUserLikes(user_id: string) {
    try {
      const data = await this.likeRepo.find({
        where: { user_id },
        relations: ['user', 'product.discount', 'product.photos'],
      });

      return { message: 'Success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  // async remove(id: string) {
  //   try {
  //     const findLike = await this.likeRepo.findOneBy({ product_id: id });

  //     if (!findLike) throw new HttpException('Like not found', 400);

  //     await this.likeRepo.delete({ product_id: id });

  //     return { message: 'Success' };
  //   } catch (error) {
  //     throw new HttpException(error.message, 400);
  //   }
  // }

  async removeAll(user_id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: user_id } });

      if (!user) throw new HttpException('User not found', 401);

      await this.likeRepo.delete({ user_id });

      return { message: 'Deleted Succesfully' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
