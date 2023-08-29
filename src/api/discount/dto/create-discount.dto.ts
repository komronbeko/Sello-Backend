import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty({
    description: 'the rate of discount',
    default: 13,
  })
  @IsNumber()
  @IsNotEmpty()
  rate: number;

  @ApiProperty({
    description: 'is  this discount still available',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
