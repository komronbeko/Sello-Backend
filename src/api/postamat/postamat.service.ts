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
    const newPostamat = await this.postamatRepo.create(body);
    await this.postamatRepo.save(newPostamat);
    return { message: 'success', data: newPostamat };
  }

  async findAll() {
    const data = await this.postamatRepo.find({
      relations: ['banners', 'categories'],
    });

    return { message: 'success', data };
  }

  async findOne(id: number) {
    const findPostamat = await this.postamatRepo.findOneBy({ id });

    if (!findPostamat) throw new HttpException('Postamat not found', 400);

    return { message: 'success', data: findPostamat };
  }

  async update(id: number, body: UpdatePostamatDto) {
    const findPostamat = await this.postamatRepo.findOneBy({ id });

    if (!findPostamat) throw new HttpException('Postamat not found', 400);

    await this.postamatRepo.update(id, body);
    return { message: 'success' };
  }

  async remove(id: number) {
    const findPostamat = await this.postamatRepo.findOneBy({ id });

    if (!findPostamat) throw new HttpException('Postamat not found', 400);

    await this.postamatRepo.delete(id);

    return { message: 'success' };
  }
}
