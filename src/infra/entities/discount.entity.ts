/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'discounts' })
export class DiscountEntity extends BaseEntity {
  @Column({ nullable: false, type: 'numeric' })
  rate: number;

  @Column({ nullable: false, type: 'date' })
  will_end: Date;

  
  @OneToMany(() => ProductEntity, (product) => product.discount)
  products: ProductEntity[];
}