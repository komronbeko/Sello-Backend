import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RegisterDto } from 'src/api/auth/dto/register.dto';

export class ReplenishBalanceDto extends PartialType(RegisterDto) {
  @ApiProperty({
    description: 'stripe',
    default: '92847`9e28u2kajshfuui34wreysfukdhjc',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'amount in dollars',
    default: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
