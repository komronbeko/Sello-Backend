/* eslint-disable prettier/prettier */
import {Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductEntity } from './product.entity';


@Entity({ name: 'brands' })
export class BrandEntity extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  photo: string;

  @OneToMany(() => ProductEntity, (product) => product.brand)
  products: ProductEntity[];
}