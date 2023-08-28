import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNestedCategoryDto {
  @ApiProperty({
    description: 'nested-category name',
    default: 'mobile phone',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'id of category which nested-category links',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  category_id: number;
}
