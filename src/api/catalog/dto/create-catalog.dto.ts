import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogDto {
  @ApiProperty({
    description: 'name of catalog',
    default: 'Electronics',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
