/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/infra/entities/review.entity';
import { ReviewRepo } from 'src/infra/repos/review.repo';
import { UserEntity } from 'src/infra/entities/user.entity';
import { UserRepo } from 'src/infra/repos/user.repo';
import { ProductRepo } from 'src/infra/repos/product.repo';
import { ProductEntity } from 'src/infra/entities/product.entity';
import { Not } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity) private reviewRepo: ReviewRepo,
    @InjectRepository(UserEntity) private userRepo: UserRepo,
    @InjectRepository(ProductEntity) private productRepo: ProductRepo,
  ) {}

  async create(body: CreateReviewDto, user_id) {
    try {
      const { product_id, commentary, stars } = body;

      const findUser = await this.userRepo.findOneBy({
        id: user_id,
      });

      const findProduct = await this.productRepo.findOneBy({
        id: product_id,
      });

      if (!findUser) throw new HttpException('User not found', 400);
      if (!findProduct) throw new HttpException('Product not found', 400);

      // const findReview = await this.reviewRepo.findOneBy({
      //   product_id,
      //   user_id,
      // });

      // if (findReview) {
      //   throw new HttpException('Already reviewed! Try to edit it', 400);
      // }

      const newReview = this.reviewRepo.create({
        product_id,
        commentary,
        stars,
        user_id,
      });

      await this.reviewRepo.save(newReview);

      return { message: 'success', data: [newReview] };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const allReviews = await this.reviewRepo.find({
        relations: ['user', 'product'],
      });
      return { message: 'success', data: allReviews };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findProductReviews(product_id: number, user_id: number) {
    try {
      const findProduct = await this.productRepo.findOneBy({
        id: product_id,
      });

      if (!findProduct) throw new HttpException('Product not found', 400);

      const productReviews = await this.reviewRepo.find({
        where: { product_id, user_id: Not(user_id) },
        relations: ['user', 'product'],
      });

      const avg = await this.reviewRepo
        .createQueryBuilder('review')
        .select('AVG(review.stars)', 'rate')
        .where('review.product_id = :product_id', { product_id })
        .getRawOne();

      return {
        message: 'success',
        data: productReviews,
        review_rate: avg.rate,
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findUserReviews(user_id: number) {
    try {
      const findUser = await this.userRepo.findOneBy({
        id: user_id,
      });

      if (!findUser) throw new HttpException('User not found', 400);

      const userReviews = await this.reviewRepo.find({
        where: { user_id },
        relations: ['user', 'product'],
      });
      return { message: 'success', data: userReviews };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOneReview(product_id: number, user_id: number) {
    try {
      const oneReview = await this.reviewRepo.findOne({
        where: { product_id, user_id },
        relations: ['user', 'product'],
      });
      return { message: 'success', data: oneReview };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(body: UpdateReviewDto) {
    const { id, commentary, stars } = body;

    const findReview = await this.reviewRepo.findOneBy({ id });

    if (!findReview) throw new HttpException('Review not found', 400);

    await this.reviewRepo.update(findReview.id, { commentary, stars });

    return { message: 'success' };
  }

  async remove(id: number) {
    try {
      const findReview = await this.reviewRepo.findOneBy({ id });

      if (!findReview) throw new HttpException('Review not found', 400);

      await this.reviewRepo.delete(id);

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
