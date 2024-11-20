import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  category_id: string;
}
