import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSearchDto {
  @ApiProperty({
    description: 'search value',
    default: 'iphone',
  })
  @IsString()
  @IsNotEmpty()
  searchValue: string;
}
