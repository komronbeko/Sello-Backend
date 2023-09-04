/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { DiscountEntity } from './discount.entity';
import { CategoryEntity } from './category.entity';
import { NestedCategoryEntity } from './nested-category.entity';
import { BrandEntity } from './brand.entity';
import { BaseEntity } from './base.entity';
import { LikeEntity } from './like.entity';
import { CartEntity } from './cart.entity';
import { ProductInfoEntity } from './product-info.entity';
import { CatalogEntity } from './catalog.entity';


@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, type: 'numeric' })
  price: number;

  @Column({ nullable: false, default: false })
  new: boolean;

  @Column({ nullable: false })
  photo: string;


  @Column({ nullable: false, default: false })
  delivery: boolean;

  @Column({ nullable: false, default: false })
  pickup: boolean;

  @Column({ nullable: false })
  delivery_country: string;

  @Column({ nullable: false, default: false })
  refund: boolean;

  @Column({ nullable: false, default: false })
  unpacked: boolean;

  @Column({ nullable: true,})
  discount_rate: number;

  @Column({ nullable: true,})
  discount_id: number;

  @Column({ nullable: false,})
  category_id: number;
  
  @Column({ nullable: false,})
  nested_category_id: number;

  @Column({ nullable: true,})
  brand_id: number;

  @Column({ nullable: false,})
  catalog_id: number;

  @ManyToOne(() => DiscountEntity, (discount) => discount.products)
  @JoinColumn({ name: 'discount_id' })
  discount: DiscountEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne(
    () => NestedCategoryEntity,
    (nestedCategory) => nestedCategory.products,
  )
  @JoinColumn({ name: 'nested_category_id' })
  nested_category: NestedCategoryEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: BrandEntity;

  @ManyToOne(() => CatalogEntity, (catalog) => catalog.products)
  @JoinColumn({ name: 'catalog_id' })
  catalog: CatalogEntity;

  @OneToMany(() => ProductInfoEntity, (productInfo) => productInfo.product, {cascade: true})
  product_infos: ProductInfoEntity[];
 
  @OneToMany(() => LikeEntity, (like) => like.product, {cascade: true})
  likes: LikeEntity[];

  @OneToMany(() => CartEntity, (cart) => cart.product, {cascade: true})
  carts: CartEntity[];
}
