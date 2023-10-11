/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { BaseEntity } from './base.entity';
import { ProductEntity } from './product.entity';


@Entity({ name: 'nested_categories' })
export class NestedCategoryEntity  extends BaseEntity{

  @Column({ nullable: false })
  name: string;
  
  @Column({ nullable: false })
  category_id: number;
  
  @ManyToOne(() => CategoryEntity, (category) => category.nestedCategories)
  @JoinColumn({name: 'category_id'})
  category: CategoryEntity;

  @OneToMany(() => ProductEntity, (product) => product.nested_category, {cascade: true})
  products: ProductEntity[];
}