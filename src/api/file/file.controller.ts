import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { v4 } from 'uuid';
import { FileUploadDto } from './dto/create-file.dto';
import { validate } from 'class-validator';

@ApiTags('File')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('file')
export class FileController {
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload file',
    type: FileUploadDto,
  })
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = v4();
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const dto = new FileUploadDto();
    dto.photo = file;
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException('File is required');
    }

    return { name: file.filename, message: 'Success' };
  }
}
