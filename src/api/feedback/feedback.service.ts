/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackEntity } from 'src/infra/entities/feedback.entity';
import { FeedbackRepo } from 'src/infra/repos/feedback.repo';
import { UserEntity } from 'src/infra/entities/user.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepo: FeedbackRepo,
    @InjectRepository(UserEntity) private readonly userRepo: FeedbackRepo,
  ) {}
  async create(body: CreateFeedbackDto, user_id) {
    try {
      const { text } = body;

      const findUser = await this.userRepo.findOneBy({ id: user_id });

      if (!findUser) throw new HttpException('User not found', 404);

      const newFeedback = await this.feedbackRepo.create({ text, user_id });

      await this.feedbackRepo.save(newFeedback);

      return { message: 'success', data: newFeedback };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    return await this.feedbackRepo.find();
  }

  async findOne(id: string) {
    return await this.feedbackRepo.findOneBy({ id });
  }

  async findByUser(user_id: string) {
    return await this.feedbackRepo.find({ where: { user_id } });
  }

  async remove(id: string) {
    return await this.feedbackRepo.delete({ id });
  }
}
