import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({
    description: 'id of product which user have liked.',
    default: 1,
  })
  @IsString()
  @IsNotEmpty()
  product_id: string;
}
