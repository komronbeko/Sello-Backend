import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';

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

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.userRegister(body);
  }

  @Delete('/logout/:id')
  logout(@Param('id') id: string) {
    return this.authService.userLogout(+id);
  }
}
