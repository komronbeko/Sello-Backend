import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    description: 'Unique branch_id of locations ',
    default: 'ID8726',
  })
  @IsString()
  @IsNotEmpty()
  branch_id: string;

  @ApiProperty({
    description: 'city where the location is located',
    default: 'Tashkent',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'exact address of location',
    default: 'Chilonzor district, Qatortol 15',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'the working hours of Location',
    default: '10:00 - 23:00',
  })
  @IsString()
  @IsNotEmpty()
  working_hours: string;
}
