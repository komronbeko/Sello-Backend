import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: "the status of order. It can be one of: 'new', 'canceled'",
    default: 'on queue',
  })
  @IsIn(['new', 'canceled'])
  @IsNotEmpty()
  status: string;
}
