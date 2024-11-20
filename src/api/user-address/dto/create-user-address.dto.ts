import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
    default: '15A',
  })
  @IsString()
  @IsNotEmpty()
  apartment: string;

  @ApiProperty({
    description: 'Address name',
    default: '110100',
  })
  @IsString()
  @IsNotEmpty()
  zip_code: string;

  @ApiProperty({
    description: 'id of user which address links',
    default: 1,
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
