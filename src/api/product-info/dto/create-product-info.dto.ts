import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductInfoDto {
  @ApiProperty({
    description: 'the detailed info about product',
    default: '{model: "Samsung", memory: "228gb"}',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    description: 'id of product to which info belongs',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  product_id: number;
}
