import { PartialType } from '@nestjs/swagger';
import { CreatePostamatDto } from './create-postamat.dto';

export class UpdatePostamatDto extends PartialType(CreatePostamatDto) {}
