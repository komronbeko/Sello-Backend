import { HttpException, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from 'src/infra/entities/location.entity';
import { LocationRepo } from 'src/infra/repos/location.repo';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepo: LocationRepo,
  ) {}
  async create(body: CreateLocationDto) {
    try {
      const newLocation = await this.locationRepo.create(body);
      await this.locationRepo.save(newLocation);
      return { message: 'success', data: newLocation };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.locationRepo.find();

      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOne(id: number) {
    try {
      const findLocation = await this.locationRepo.findOneBy({ id });

      if (!findLocation) throw new HttpException('Location not found', 400);

      return { message: 'success', data: findLocation };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(id: number, body: UpdateLocationDto) {
    try {
      const findLocation = await this.locationRepo.findOneBy({ id });

      if (!findLocation) throw new HttpException('Location not found', 400);

      await this.locationRepo.update(id, body);
      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: number) {
    try {
      const findLocation = await this.locationRepo.findOneBy({ id });

      if (!findLocation) throw new HttpException('Location not found', 400);

      await this.locationRepo.delete(id);

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
