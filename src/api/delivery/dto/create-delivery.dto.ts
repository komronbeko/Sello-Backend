import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDeliveryDto {
  @ApiProperty({
    description:
      'Delivery method: it can be one of "delivery_service", "pickup", "postamat"',
    default: 'pickup',
  })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({
    description: 'Delivery country',
    default: 'Uzbekistan',
  })
  @IsString()
  @IsNotEmpty()
  delivery_country: string;

  @ApiProperty({
    description: 'the date of delivery.',
    default: '2023-08-28',
  })
  @IsString()
  @IsNotEmpty()
  delivery_date: string;

  @ApiProperty({
    description: 'the id of user_address',
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  user_address_id: number;

  @ApiProperty({
    description: "the id of one of Sello's branch location",
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  location_id: number;

  @ApiProperty({
    description: 'Postamat ID',
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  postamat_id: number;
}
