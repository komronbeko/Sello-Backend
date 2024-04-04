import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({
    description: 'The ID of the review',
    default: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

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
