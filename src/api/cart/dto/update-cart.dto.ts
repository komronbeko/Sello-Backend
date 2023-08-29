import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @ApiProperty({
    description: 'id of order',
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  order_id: number;
}
