/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { FeedbackEntity } from '../entities/feedback.entity';

export type FeedbackRepo = Repository<FeedbackEntity>;
