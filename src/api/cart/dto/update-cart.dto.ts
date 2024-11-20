import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @ApiProperty({
    description: 'id of order',
    default: 1,
  })
  @IsString()
  @IsOptional()
  order_id: string;
}
