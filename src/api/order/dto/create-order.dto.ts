import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

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
      "the status of order. It can be one of: 'on queue', 'prepared', 'delivering', 'ready', 'canceled'",
    default: 'on queue',
  })
  @IsIn(['on queue', 'prepared', 'delivering', 'ready', 'canceled'])
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Postamat ID',
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  user_id: number;
}
