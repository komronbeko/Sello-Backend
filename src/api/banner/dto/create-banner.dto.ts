import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({
    description: 'title for banner',
    default: 'Free sale!!!',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'photo url for banner',
    default: '18b60227-f8cb-439c-a2d7-d18e47732038.jpg',
  })
  @IsString()
  @IsNotEmpty()
  photo: string;

  @ApiProperty({
    description: 'id of catalog which banner links',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  catalog_id: number;
}
