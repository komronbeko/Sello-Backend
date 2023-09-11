import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostamatDto } from './dto/create-postamat.dto';
import { UpdatePostamatDto } from './dto/update-postamat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostamatEntity } from 'src/infra/entities/postamat.entity';
import { PostamatRepo } from 'src/infra/repos/postamat.repo';

@Injectable()
export class PostamatService {
  constructor(
    @InjectRepository(PostamatEntity)
    private readonly postamatRepo: PostamatRepo,
  ) {}
  async create(body: CreatePostamatDto) {
    try {
      const newPostamat = await this.postamatRepo.create(body);
      await this.postamatRepo.save(newPostamat);
      return { message: 'success', data: newPostamat };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.postamatRepo.find({
        relations: ['banners', 'categories'],
      });

      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOne(id: number) {
    try {
      const findPostamat = await this.postamatRepo.findOneBy({ id });

      if (!findPostamat) throw new HttpException('Postamat not found', 400);

      return { message: 'success', data: findPostamat };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(id: number, body: UpdatePostamatDto) {
    try {
      const findPostamat = await this.postamatRepo.findOneBy({ id });

      if (!findPostamat) throw new HttpException('Postamat not found', 400);

      await this.postamatRepo.update(id, body);
      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: number) {
    try {
      const findPostamat = await this.postamatRepo.findOneBy({ id });

      if (!findPostamat) throw new HttpException('Postamat not found', 400);

      await this.postamatRepo.delete(id);

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
