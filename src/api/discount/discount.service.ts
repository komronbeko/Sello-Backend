import { HttpException, Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from 'src/infra/entities/discount.entity';
import { DiscountRepo } from 'src/infra/repos/discount.repo';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepo: DiscountRepo,
  ) {}
  async create(body: CreateDiscountDto) {
    try {
      const newDiscount = await this.discountRepo.create(body);
      await this.discountRepo.save(newDiscount);
      return { message: 'success', data: newDiscount };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.discountRepo.find();

      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOne(id: string) {
    try {
      const findDiscount = await this.discountRepo.findOneBy({ id });

      if (!findDiscount) throw new HttpException('Discount not found', 400);

      return { message: 'success', data: findDiscount };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(id: string, body: UpdateDiscountDto) {
    try {
      const findDiscount = await this.discountRepo.findOneBy({ id });

      if (!findDiscount) throw new HttpException('Discount not found', 400);

      await this.discountRepo.update(id, body);
      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: string) {
    const findDiscount = await this.discountRepo.findOneBy({ id });

    if (!findDiscount) throw new HttpException('Discount not found', 400);

    await this.discountRepo.delete(id);

    return { message: 'success' };
  }
}
