import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/infra/entities/admin.entity';
import { UserEntity } from 'src/infra/entities/user.entity';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEC_KEY,
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forFeature([AdminEntity, UserEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
