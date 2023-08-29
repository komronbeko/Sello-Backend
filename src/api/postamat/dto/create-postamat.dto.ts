import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostamatDto {
  @ApiProperty({
    description: 'the name of branch for postamat',
    default: 'Sello02',
  })
  @IsString()
  @IsNotEmpty()
  branch: string;

  @ApiProperty({
    description: 'exact address of the postamat',
    default: 'Tashkent, Uzbekistan, Zulfiyakhanum street, 12',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
