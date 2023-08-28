import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty({
    description: 'categoryname',
    default: 'technology',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'id of catalog which category links',
    default: 'Dec 15, 2023',
  })
  @IsNumber()
  @IsNotEmpty()
  will_end: string;
}
