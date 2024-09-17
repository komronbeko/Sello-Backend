import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  @IsNotEmpty({ message: 'File is required' })
  photo: any;
}

module.exports = FileUploadDto;
