import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostamatService } from './postamat.service';
import { CreatePostamatDto } from './dto/create-postamat.dto';
import { UpdatePostamatDto } from './dto/update-postamat.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Postamats')
@Controller('postamat')
export class PostamatController {
  constructor(private readonly postamatService: PostamatService) {}

  @Post()
  create(@Body() createPostamatDto: CreatePostamatDto) {
    return this.postamatService.create(createPostamatDto);
  }

  @Get()
  findAll() {
    return this.postamatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postamatService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostamatDto: UpdatePostamatDto,
  ) {
    return this.postamatService.update(+id, updatePostamatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postamatService.remove(+id);
  }
}
