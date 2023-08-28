/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/infra/entities/admin.entity';
import { AdminRepo } from 'src/infra/repos/admin.repo';

@Injectable()
export class isAdminGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(AdminEntity) private readonly adminRepo: AdminRepo,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const token =
        request.headers.authorization?.split(' ')[1] ??
        request.headers.authorization;

      if (!token) return false;

      const verified = this.jwt.verify(token, {
        secret: process.env.JWT_SEC_KEY,
      });

      const findAdmin = await this.adminRepo.findOneBy({ id: verified.id });

      if (!findAdmin) return false;

      request.adminId = verified.id;

      return true;
    } catch (error) {
      throw new HttpException('Invalid token', 403);
    }
  }
}