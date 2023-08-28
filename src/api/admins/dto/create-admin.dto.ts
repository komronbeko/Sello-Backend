import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'username of admin',
    default: 'username123',
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'email of admin',
    default: 'example@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'alphanumeric password of admin',
    default: 'password1234',
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description:
      'Role of admin. By default, it is "admin". Or it can be "super"',
    default: 'admin',
  })
  @IsString()
  @IsIn(['admin', 'super'])
  role: 'admin' | 'super';
}
