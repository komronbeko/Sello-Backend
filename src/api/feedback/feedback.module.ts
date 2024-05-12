import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackEntity } from 'src/infra/entities/feedback.entity';
import { UserEntity } from 'src/infra/entities/user.entity';
// import { UserEntity } from 'src/infra/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity, UserEntity])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
