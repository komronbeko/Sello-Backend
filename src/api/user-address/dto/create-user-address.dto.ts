import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserAddressDto {
  @ApiProperty({
    description: 'the name city',
    default: 'Tashkent',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'the name of district',
    default: 'Chilonzor',
  })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({
    description: 'the name of street',
    default: 'Gulxaniy',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    description: 'the apartment number or name',
    default: 'technology',
  })
  @IsString()
  @IsNotEmpty()
  apartment: string;

  @ApiProperty({
    description: 'addressname',
    default: 'technology',
  })
  @IsString()
  @IsNotEmpty()
  zip_code: number;

  @ApiProperty({
    description: 'id of user which address links',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
