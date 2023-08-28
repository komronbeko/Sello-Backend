import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminRepo } from 'src/infra/repos/admin.repo';
import { AdminEntity } from 'src/infra/entities/admin.entity';
import { UserEntity } from 'src/infra/entities/user.entity';
import { UserRepo } from 'src/infra/repos/user.repo';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminsRepo: AdminRepo,
    @InjectRepository(UserEntity)
    private readonly usersRepo: UserRepo,
    private readonly jwt: JwtService,
  ) {}
  async adminLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const findAdmin = await this.adminsRepo.findOneBy({ email });

    if (!findAdmin) throw new ForbiddenException();

    const comparePass = await bcrypt.compare(password, findAdmin.password);

    if (!comparePass) throw new ForbiddenException();

    const token = this.jwt.sign({ id: findAdmin.id });

    return { message: 'success', data: token };
  }

  async userLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const findUser = await this.usersRepo.findOneBy({ email });

    if (!findUser) throw new ForbiddenException();

    const comparePass = await bcrypt.compare(password, findUser.password);

    if (!comparePass) throw new ForbiddenException();

    const token = this.jwt.sign({ id: findUser.id });

    return { message: 'success', data: token };
  }

  async userRegister(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const findUser = await this.usersRepo.findOneBy({ email, username });

    if (findUser) throw new HttpException('User already exists', 403);

    const hashedPass = await bcrypt.hash(password, 12);

    const newUser = await this.usersRepo.create({
      username,
      email,
      password: hashedPass,
    });

    await this.usersRepo.save(newUser);

    const token = this.jwt.sign({ id: newUser.id });

    return { message: 'success', data: token };
  }

  async userLogout(id: number) {
    const findUser = await this.usersRepo.findOneBy({ id });

    if (!findUser) throw new HttpException('User not found', 400);

    await this.usersRepo.delete({ id });

    return { message: 'success' };
  }
}
