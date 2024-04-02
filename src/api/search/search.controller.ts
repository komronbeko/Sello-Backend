import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags } from '@nestjs/swagger';
// import { CacheInterceptor } from '@nestjs/cache-manager';
// import { CreateSearchDto } from './dto/create-search.dto';
// import { UpdateSearchDto } from './dto/update-search.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // @UseInterceptors(CacheInterceptor)
  // @CacheKey('custom-key')
  @Get()
  search(@Query('value') searchValue: string) {
    return this.searchService.search(searchValue);
  }
}
