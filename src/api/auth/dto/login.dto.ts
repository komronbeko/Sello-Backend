import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'alphanumeric password for login',
    default: 'password1234',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Unique email for login',
    default: 'test@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Role of admin. It can be either "super" or just "admin"',
    default: 'admin',
  })
  @IsString()
  @IsOptional()
  @IsIn(['admin', 'super'])
  role: 'admin' | 'super';
}
