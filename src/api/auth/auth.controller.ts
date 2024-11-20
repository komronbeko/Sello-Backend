import { Controller, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { OtpDto } from './dto/otp.dto';
import { PassResetDto } from './dto/pass-reset.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-admin')
  adminLogin(@Body() body: LoginDto) {
    return this.authService.adminLogin(body);
  }

  @Post('login-user')
  userLogin(@Body() body: LoginDto) {
    return this.authService.userLogin(body);
  }

  @Post('otp')
  otp(@Body() body: OtpDto) {
    return this.authService.otpForEmailReset(body);
  }

  @Post('verify-otp/:id')
  otpVerify(@Param('id') id: string, @Body() body: VerifyDto) {
    return this.authService.otpVerify(id, body);
  }

  @Post('verify-user/:id')
  userVerify(@Param('id') id: string, @Body() body: VerifyDto) {
    return this.authService.userVerify(id, body);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.userRegister(body);
  }

  @Patch('pass-reset/:id')
  passReset(@Param('id') user_id: string, @Body() body: PassResetDto) {
    return this.authService.passReset(user_id, body);
  }

  @Delete('/logout/:id')
  logout(@Param('id') id: string) {
    return this.authService.userLogout(id);
  }
}
