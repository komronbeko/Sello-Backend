/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
  @IsNotEmpty()
  new: boolean;

  @ApiProperty({
    description: 'photo url for product',
    default: '18b60227-f8cb-439c-a2d7-d18e47732038.jpg',
  })
  @IsString()
  @IsNotEmpty()
  photo: string;

  @ApiProperty({
    description: 'whether it is deliverable or not',
    default: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  delivery: boolean;

  @ApiProperty({
    description: 'alphanumeric id of branch',
    default: 'ID4335',
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  branch_id: string;

  @ApiProperty({
    description: 'is it possible to pickup?',
    default: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  pickup: boolean;

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
    description: 'the id of catalog to which product belongs',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  catalog_id: number;

  @ApiProperty({
    description: 'the id of category to which product belongs',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({
    description: 'the id of nested-category to which product belongs',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  nested_category_id: number;

  @ApiProperty({
    description: 'the id of discount the product has',
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  discount_id: number;

  @ApiProperty({
    description: 'the id of brand by which the product was made',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  brand_id: number;
}
