import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class VerifyProdDto {
  @ApiProperty({
    description: 'Product ID',
  })
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty({
    description: 'The response of Admin',
  })
  @IsBoolean()
  @IsNotEmpty()
  is_verified: boolean;
}
