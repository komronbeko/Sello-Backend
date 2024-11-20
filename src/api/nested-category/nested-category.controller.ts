import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NestedCategoryService } from './nested-category.service';
import { CreateNestedCategoryDto } from './dto/create-nested-category.dto';
import { UpdateNestedCategoryDto } from './dto/update-nested-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Nested-Categories')
@Controller('nested-category')
export class NestedCategoryController {
  constructor(private readonly nestedCategoryService: NestedCategoryService) {}

  @Post()
  create(@Body() createNestedCategoryDto: CreateNestedCategoryDto) {
    return this.nestedCategoryService.create(createNestedCategoryDto);
  }

  @Get()
  findAll() {
    return this.nestedCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nestedCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNestedCategoryDto: UpdateNestedCategoryDto,
  ) {
    return this.nestedCategoryService.update(id, updateNestedCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nestedCategoryService.remove(id);
  }
}
