import { Repository } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';

export type NotificationRepo = Repository<NotificationEntity>;
