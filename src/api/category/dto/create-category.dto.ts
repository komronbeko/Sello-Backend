import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'categoryname',
    default: 'technology',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'id of catalog which category links',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  catalog_id: number;
}
