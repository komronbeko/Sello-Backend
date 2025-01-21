import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: 'Page number for pagination', default: 1 })
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({ description: 'limit of products to load', default: 10 })
  @IsNumber()
  @Min(1)
  limit: number = 10;
}
