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
    const newLocation = await this.locationRepo.create(body);
    await this.locationRepo.save(newLocation);
    return { message: 'success', data: newLocation };
  }

  async findAll() {
    const data = await this.locationRepo.find();

    return { message: 'success', data };
  }

  async findOne(id: number) {
    const findLocation = await this.locationRepo.findOneBy({ id });

    if (!findLocation) throw new HttpException('Location not found', 400);

    return { message: 'success', data: findLocation };
  }

  async update(id: number, body: UpdateLocationDto) {
    const findLocation = await this.locationRepo.findOneBy({ id });

    if (!findLocation) throw new HttpException('Location not found', 400);

    await this.locationRepo.update(id, body);
    return { message: 'success' };
  }

  async remove(id: number) {
    const findLocation = await this.locationRepo.findOneBy({ id });

    if (!findLocation) throw new HttpException('Location not found', 400);

    await this.locationRepo.delete(id);

    return { message: 'success' };
  }
}
