import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'The ID of the product',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({
    description: 'star counts of the product',
    default: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  stars: number;

  @ApiProperty({
    description: 'commentary by user',
    default: 'worth the price',
  })
  @IsString()
  commentary: string;
}
