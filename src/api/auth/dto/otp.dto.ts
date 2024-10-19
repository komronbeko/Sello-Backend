import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class OtpDto {
  @ApiProperty({
    description: 'Unique email for login',
    default: 'test@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
