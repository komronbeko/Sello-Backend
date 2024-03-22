import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyDto {
  @ApiProperty({
    description: 'Send back the hashed code sent from the backend',
    default: 'hiduqwgbjacs,huewyehrskafajwcSQWIYEU',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Enter the code sent to your email ',
    default: '123456',
  })
  @IsString()
  @IsNotEmpty()
  verify_code: string;
}
