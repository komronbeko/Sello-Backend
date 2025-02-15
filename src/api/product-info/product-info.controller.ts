import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductInfoService } from './product-info.service';
import { CreateProductInfoDto } from './dto/create-product-info.dto';
import { UpdateProductInfoDto } from './dto/update-product-info.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product-Infos')
@Controller('product-info')
export class ProductInfoController {
  constructor(private readonly productInfoService: ProductInfoService) {}

  @Post()
  create(@Body() createProductInfoDto: CreateProductInfoDto) {
    return this.productInfoService.create(createProductInfoDto);
  }

  @Get()
  findAll() {
    return this.productInfoService.findAll();
  }

  @Get(':product_id')
  infosForProduct(@Param('product_id') product_id: string) {
    return this.productInfoService.infosForProduct(product_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductInfoDto: UpdateProductInfoDto,
  ) {
    return this.productInfoService.update(id, updateProductInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productInfoService.remove(id);
  }
}
