import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    description: 'name of brand',
    default: 'Coco',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'photo url for brand',
    default: '18b60227-f8cb-439c-a2d7-d18e47732038.jpg',
  })
  @IsString()
  @IsNotEmpty()
  photo: string;
}
