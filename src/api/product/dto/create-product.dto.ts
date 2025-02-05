import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'name of product',
    default: 'hand-bag',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'description of product',
    default: 'portable handbake to take your items in',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'price of product in dollar',
    default: 27,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'is product new or not',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  new: boolean;

  @ApiProperty({
    description: 'photo urls for product',
    default: ['18b60227-f8cb-439c-a2d7-d18e47732038.jpg'],
  })
  @IsArray()
  @IsOptional()
  photoPaths: string[];

  @ApiProperty({
    description: 'whether it is deliverable or not',
    default: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  delivery: boolean;

  @ApiProperty({
    description: 'the country where the product will be delivered from',
    default: 'Uzbekistan',
  })
  @IsString()
  @IsNotEmpty()
  delivery_country: string;

  @ApiProperty({
    description: 'is it refundable or not',
    default: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  refund: boolean;

  @ApiProperty({
    description: 'is it unpacked?',
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  unpacked: boolean;

  @ApiProperty({
    description: 'is it verified by Admin?',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_verified: boolean;

  @ApiProperty({
    description: 'the id of catalog to which product belongs',
    default: 1,
  })
  @IsString()
  @IsNotEmpty()
  catalog_id: string;

  @ApiProperty({
    description: 'the id of category to which product belongs',
    default: 1,
  })
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty({
    description: 'the id of nested-category to which product belongs',
    default: 1,
  })
  @IsString()
  @IsOptional()
  nested_category_id: string;

  @ApiProperty({
    description: 'the id of discount the product has',
    default: 1,
  })
  @IsString()
  @IsOptional()
  discount_id: string;
}
