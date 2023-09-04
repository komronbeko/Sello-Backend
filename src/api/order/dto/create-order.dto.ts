import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The total cost of order in dollars',
    default: 660,
  })
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @ApiProperty({
    description: "the status of order. It can be one of: 'new', 'canceled'",
    default: 'on queue',
  })
  @IsIn(['new', 'canceled'])
  @IsOptional()
  status: string;

  @ApiProperty({
    description:
      'The IDs of carts which user is ordering(Array in string form)',
    default: '[1, 2]',
  })
  @IsString()
  @IsOptional()
  carts_id: string;

  @ApiProperty({
    description: 'location of user in object',
    default: {
      evenue: 'Bobur',
      city: 'Karshi',
      district: 'Eski Shahar',
      street: 'Qator tut, 15',
    },
  })
  @IsNotEmpty()
  location: object;

  @ApiProperty({
    description: 'Postamat ID',
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  user_id: number;
}
