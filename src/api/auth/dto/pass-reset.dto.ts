import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty } from 'class-validator';

export class PassResetDto {
  @ApiProperty({
    description: 'new  password',
    default: 'daredevil-2',
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  new_pass: string;
}
