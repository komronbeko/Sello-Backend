import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    description: 'is it in the cart?',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;

  @ApiProperty({
    description:
      'the current status of cart. it can be either "paid" or "unpaid"',
    default: 'unpaid',
  })
  @IsOptional()
  @IsIn(['paid', 'unpaid'])
  status: 'paid' | 'unpaid';

  @ApiProperty({
    description: 'id of product which user have chosen.',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  product_id: number;
}
