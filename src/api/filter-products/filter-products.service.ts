import { Injectable } from '@nestjs/common';

@Injectable()
export class FilterProductsService {
  applyFilters() {
    return `This action returns all filterProducts`;
  }
}
