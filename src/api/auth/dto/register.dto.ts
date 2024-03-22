import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'alphanumeric username for register',
    default: 'ehmat123',
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'email of username for register',
    default: 'ehmat123@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password of username for register',
    default: 'daredevil',
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;
}
