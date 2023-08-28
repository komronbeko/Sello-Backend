import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsString } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty({
    description: 'phone_number of admin',
    default: '+998990008899',
  })
  @IsString()
  phone_number: string;

  @ApiProperty({
    description: 'photo url of admin',
    default: '7f77f27b-5e08-4663-9283-e7e8d2ced925.jpg',
  })
  @IsString()
  photo: string;
}
