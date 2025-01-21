import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'title for notification',
    default: 'Test',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'description for notification',
    default: 'Write down me!',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'the id of user to which notification will be sent',
    default: 1,
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
