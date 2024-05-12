import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'text Default ',
    default: 'lorem impus dolar',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}
