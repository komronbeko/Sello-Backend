import { HttpException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/infra/entities/notification.entity';
import { NotificationRepo } from 'src/infra/repos/notification.repo';
import { UserRepo } from 'src/infra/repos/user.repo';
import { UserEntity } from 'src/infra/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: NotificationRepo,
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepo,
  ) {}

  async create(body: CreateNotificationDto) {
    try {
      const findUser = await this.userRepo.findOneBy({
        id: body.user_id,
      });

      if (!findUser) throw new HttpException('User ot found', 400);

      const newNotification = await this.notificationRepo.create(body);
      await this.notificationRepo.save(newNotification);

      return { message: 'success', data: newNotification };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.notificationRepo.find({ relations: ['user'] });

      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOne(id: number) {
    try {
      const findNotification = await this.notificationRepo.findOneBy({ id });

      if (!findNotification)
        throw new HttpException('Notification not found', 400);

      return { message: 'success', data: findNotification };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(id: number, body: UpdateNotificationDto) {
    try {
      const findNotification = await this.notificationRepo.findOneBy({ id });

      if (!findNotification)
        throw new HttpException('Notification not found', 400);

      await this.notificationRepo.update(id, body);
      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: number) {
    try {
      const findNotification = await this.notificationRepo.findOneBy({ id });

      if (!findNotification)
        throw new HttpException('Notification not found', 400);

      await this.notificationRepo.delete(id);

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
