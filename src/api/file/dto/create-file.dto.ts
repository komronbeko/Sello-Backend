import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Photo for the product',
  })
  @IsNotEmpty({ message: 'File is required' })
  photo: any;
}

// module.exports = FileUploadDto;
