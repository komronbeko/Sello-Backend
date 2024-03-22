import { PartialType } from '@nestjs/swagger';
import { CreateNestedCategoryDto } from './create-nested-category.dto';

export class UpdateNestedCategoryDto extends PartialType(
  CreateNestedCategoryDto,
) {}
