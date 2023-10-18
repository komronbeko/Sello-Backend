/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Get('/filters/all-in-one')
  sort(
    @Query('value') value: string,
    @Query('catalog_id') catalog_id: string,
    @Query('category_id') category_id: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('discounts') discounts_arr: string,
    @Query('brands') brands_arr: string,
    @Query('sub_categories') sub_categories_arr: string,
    @Query('product_infos') product_infos_arr: string,
  ) {
    return this.productService.sort(
      value,
      +catalog_id,
      +category_id,
      +from,
      +to,
      discounts_arr,
      brands_arr,
      sub_categories_arr,
      product_infos_arr,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
