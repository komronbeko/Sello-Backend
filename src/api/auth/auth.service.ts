/* eslint-disable @typescript-eslint/no-unused-vars */
import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminRepo } from 'src/infra/repos/admin.repo';
import { AdminEntity } from 'src/infra/entities/admin.entity';
import { UserEntity } from 'src/infra/entities/user.entity';
import { UserRepo } from 'src/infra/repos/user.repo';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { FindOneOptions } from 'typeorm';

const transporter = nodemailer.createTransport({
  port: 465,
  host: 'smtp.gmail.com',
  auth: {
    user: 'uzakovumar338@gmail.com',
    pass: 'ecfuorlboksqoiwd',
  },
  secure: true,
});

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
    try {
      const { email, password } = loginDto;

      const findAdmin = await this.adminsRepo.findOneBy({ email });

      if (!findAdmin) throw new ForbiddenException();

      const comparePass = await bcrypt.compare(password, findAdmin.password);

      if (!comparePass) throw new ForbiddenException();

      const expiresInOneYear = 365 * 24 * 60 * 60;

      const token = this.jwt.sign({ id: findAdmin.id }, {
        expiresIn: expiresInOneYear,
      } as JwtSignOptions);

      return { message: 'success', data: token };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async userLogin(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      const findUser = await this.usersRepo.findOneBy({ email });

      if (!findUser) throw new ForbiddenException();

      const comparePass = await bcrypt.compare(password, findUser.password);

      if (!comparePass) throw new ForbiddenException();

      const code: number = Math.floor(100000 + Math.random() * 900000);

      const hashedCode = await bcrypt.hash(code.toString(), 12);

      const mailData = {
        from: 'uzakovumar338@gmail.com',
        to: email,
        subject: 'Sello Online Magazine',
        text: 'Verification',
        html: `<b>Your verification code is: ${code}</b>`,
      };

      const data = await transporter.sendMail(mailData);

      return {
        message: 'Verification code is sent to your eamil',
        data: { code: hashedCode, user_id: findUser.id },
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async userRegister(registerDto: RegisterDto) {
    try {
      const { username, email, password } = registerDto;

      const code: number = Math.floor(100000 + Math.random() * 900000);

      const hashedCode = await bcrypt.hash(code.toString(), 12);

      const mailData = {
        from: 'uzakovumar338@gmail.com',
        to: email,
        subject: 'Sello Online Magazine',
        text: 'Verification',
        html: `<b>Your verification code is: ${code}</b>`,
      };
      const findUser = await this.usersRepo.findOne({
        where: [{ username }, { email }],
      } as FindOneOptions);

      if (findUser) {
        switch (findUser.is_verified) {
          case true:
            throw new HttpException('User alreaday exists', 403);
          case false:
            const data = await transporter.sendMail(mailData);
            return {
              message: 'Verification code is sent to your eamil',
              data: { code: hashedCode, user_id: findUser.id },
            };
        }
      }

      const hashedPass = await bcrypt.hash(password, 12);

      const newUser = await this.usersRepo.create({
        username,
        email,
        password: hashedPass,
      });

      await this.usersRepo.save(newUser);

      const data = await transporter.sendMail(mailData);

      return {
        message: 'Verification code is sent to your eamil',
        data: { code: hashedCode, user_id: newUser.id },
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async userVerify(id: number, body: VerifyDto) {
    try {
      const { verify_code, code } = body;

      const data = await bcrypt.compare(verify_code.toString(), code);

      if (!data)
        throw new HttpException('Verfication code does not match', 403);

      const findUser = await this.usersRepo.findOneBy({ id });

      if (!findUser) throw new HttpException('User not found', 400);

      await this.usersRepo.update(id, { is_verified: true });

      const expiresInOneYear = 365 * 24 * 60 * 60;

      const token = this.jwt.sign({ id: findUser.id }, {
        expiresIn: expiresInOneYear,
      } as JwtSignOptions);

      return { message: 'success', token };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async userLogout(id: number) {
    try {
      const findUser = await this.usersRepo.findOneBy({ id });

      if (!findUser) throw new HttpException('User not found', 400);

      await this.usersRepo.update(id, { is_verified: false });

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
