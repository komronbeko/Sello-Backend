import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/infra/entities/admin.entity';
import { AdminRepo } from 'src/infra/repos/admin.repo';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService implements OnModuleInit {
  constructor(
    @InjectRepository(AdminEntity) private readonly adminsRepo: AdminRepo,
  ) {}

  async onModuleInit() {
    const admins = await this.adminsRepo.find();

    if (admins.length === 0) {
      await this.adminsRepo.save({
        username: 'olimov123',
        password: process.env.ADMIN_PASS,
        email: process.env.ADMIN_EMAIL,
        role: 'super',
      });
    }
  }

  async create(body: CreateAdminDto) {
    const { username, email, password, role } = body;

    const findAdmin = await this.adminsRepo.findOneBy({ username, email });

    if (findAdmin) throw new HttpException('This Admin already exists', 200);

    const hashedPass = await bcrypt.hash(password, 12);

    const newAdmin = await this.adminsRepo.create({
      username,
      email,
      password: hashedPass,
      role,
    });

    await this.adminsRepo.save(newAdmin);

    return {
      message: 'success',
      data: newAdmin,
    };
  }

  async findAll() {
    const admins = await this.adminsRepo.find();
    return { message: 'success', data: admins };
  }

  async findOne(id: number) {
    const findAdmin = await this.adminsRepo.findOneBy({ id });

    if (!findAdmin) throw new HttpException('Admin nnot found', 400);

    return { message: 'success', findAdmin };
  }

  async update(id: number, body: UpdateAdminDto) {
    const findAdmin = await this.adminsRepo.findOneBy({ id });

    if (!findAdmin) throw new HttpException('Admin not found', 400);

    await this.adminsRepo.update(id, body);

    return { message: 'success' };
  }

  async remove(id: number) {
    const findAdmin = await this.adminsRepo.findOneBy({ id });

    if (!findAdmin) throw new HttpException('Admin not found', 400);

    await this.adminsRepo.delete(id);

    return { message: 'success' };
  }
}
