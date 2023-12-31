import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { RegisterDto } from 'src/api/auth/dto/register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiProperty({
    description: 'firstname of user',
    default: 'Eshmat',
  })
  @IsString()
  @IsOptional()
  f_name: string;

  @ApiProperty({
    description: 'lastname user',
    default: 'Turdiyev',
  })
  @IsString()
  @IsOptional()
  l_name: string;

  @ApiProperty({
    description: 'phone number of user',
    default: '+998998899889',
  })
  @IsString()
  @IsOptional()
  phone_number: string;

  @ApiProperty({
    description: 'spoken language of user',
    default: 'english',
  })
  @IsString()
  @IsOptional()
  @IsIn(['english', 'russian'])
  language: string;

  @ApiProperty({
    description: 'gender of user',
    default: 'male',
  })
  @IsString()
  @IsOptional()
  @IsIn(['male', 'female'])
  gender: string;

  @ApiProperty({
    description: 'photo url for user profile',
    default: '18b60227-f8cb-439c-a2d7-d18e47732038.jpg',
  })
  @IsString()
  @IsOptional()
  photo: string;

  @ApiProperty({
    description: 'birthdate of user',
    default: '28/04/2005',
  })
  @IsString()
  @IsOptional()
  birthdate: string;
}
