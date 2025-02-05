import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class PassResetDto {
  @ApiProperty({
    description: 'new  password',
    default: 'daredevil-2',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  new_pass: string;
}
