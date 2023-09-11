import { HttpException, Injectable } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerEntity } from 'src/infra/entities/partner.entity';
import { PartnerRepo } from 'src/infra/repos/partner.repo';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(PartnerEntity)
    private readonly partnerRepo: PartnerRepo,
  ) {}
  async create(body: CreatePartnerDto) {
    try {
      const newPartner = await this.partnerRepo.create(body);
      await this.partnerRepo.save(newPartner);
      return { message: 'success', data: newPartner };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll() {
    try {
      const data = await this.partnerRepo.find();

      return { message: 'success', data };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOne(id: number) {
    try {
      const findPartner = await this.partnerRepo.findOneBy({ id });

      if (!findPartner) throw new HttpException('Partner not found', 400);

      return { message: 'success', data: findPartner };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(id: number, body: UpdatePartnerDto) {
    try {
      const findPartner = await this.partnerRepo.findOneBy({ id });

      if (!findPartner) throw new HttpException('Partner not found', 400);

      await this.partnerRepo.update(id, body);
      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: number) {
    try {
      const findPartner = await this.partnerRepo.findOneBy({ id });

      if (!findPartner) throw new HttpException('Partner not found', 400);

      await this.partnerRepo.delete(id);

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
