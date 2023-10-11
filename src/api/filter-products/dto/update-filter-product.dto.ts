import { PartialType } from '@nestjs/swagger';
import { CreateFilterProductDto } from './create-filter-product.dto';

export class UpdateFilterProductDto extends PartialType(CreateFilterProductDto) {}
