import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The total cost of order in dollars',
    default: 660,
  })
  @IsNumber()
  @IsNotEmpty()
  cost: number;

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
}
