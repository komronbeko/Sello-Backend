import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({
    description: 'id of product which user have liked.',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  product_id: number;
}
