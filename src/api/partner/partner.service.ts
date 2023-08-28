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
    const newPartner = await this.partnerRepo.create(body);
    await this.partnerRepo.save(newPartner);
    return { message: 'success', data: newPartner };
  }

  async findAll() {
    const data = await this.partnerRepo.find();

    return { message: 'success', data };
  }

  async findOne(id: number) {
    const findPartner = await this.partnerRepo.findOneBy({ id });

    if (!findPartner) throw new HttpException('Partner not found', 400);

    return { message: 'success', data: findPartner };
  }

  async update(id: number, body: UpdatePartnerDto) {
    const findPartner = await this.partnerRepo.findOneBy({ id });

    if (!findPartner) throw new HttpException('Partner not found', 400);

    await this.partnerRepo.update(id, body);
    return { message: 'success' };
  }

  async remove(id: number) {
    const findPartner = await this.partnerRepo.findOneBy({ id });

    if (!findPartner) throw new HttpException('Partner not found', 400);

    await this.partnerRepo.delete(id);

    return { message: 'success' };
  }
}
