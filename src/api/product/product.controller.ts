import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { myReq } from 'src/infra/interfaces/custom-request';
import { VerifyProdDto } from './dto/verify-product.dto';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() body: CreateProductDto, @Req() req: myReq) {
    return this.productService.create(body, req.userId);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.productService.findAll({ page, limit });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/user-products')
  getUserProducts(@Req() req: myReq) {
    return this.productService.userProducts(req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/unverified/get-all')
  getUnverified() {
    return this.productService.getUnverified();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('/verify')
  verifyProduct(@Body() body: VerifyProdDto) {
    return this.productService.verifyProduct(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('/deleted/one-user')
  findDeleted(@Req() req: myReq) {
    return this.productService.fetchDeleted(req.userId);
  }

  @Get('/filters/all-in-one')
  sort(
    @Query('value') value: string,
    @Query('catalog_id') catalog_id: string,
    @Query('category_id') category_id: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('discounts') discounts_arr: string,
    @Query('sub_categories') sub_categories_arr: string,
    @Query('product_infos') product_infos_arr: string,
  ) {
    return this.productService.sort(
      value,
      catalog_id,
      category_id,
      from,
      to,
      discounts_arr,
      sub_categories_arr,
      product_infos_arr,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/soft-delete/user-products')
  softDeleteUserProducts(@Req() req: myReq) {
    return this.productService.softDeleteUserProducts(req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/hard-delete/user-products')
  hardDeleteUserProducts(@Req() req: myReq) {
    return this.productService.hardDeleteUserProducts(req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: myReq) {
    return this.productService.delete(id, req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('/restore/:id')
  restoreProduct(@Param('id') id: string) {
    return this.productService.restoreProduct(id);
  }
}
