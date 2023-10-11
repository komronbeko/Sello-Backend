import { Controller, Get } from '@nestjs/common';
import { FilterProductsService } from './filter-products.service';

@Controller('filter-products')
export class FilterProductsController {
  constructor(private readonly filterProductsService: FilterProductsService) {}

  @Get()
  applyFilters() {
    return this.filterProductsService.applyFilters();
  }
}
