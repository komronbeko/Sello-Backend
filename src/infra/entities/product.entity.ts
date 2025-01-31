import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DiscountEntity } from './discount.entity';
import { CategoryEntity } from './category.entity';
import { NestedCategoryEntity } from './nested-category.entity';
import { BaseEntity } from './base.entity';
import { LikeEntity } from './like.entity';
import { CartEntity } from './cart.entity';
import { ProductInfoEntity } from './product-info.entity';
import { CatalogEntity } from './catalog.entity';
import { ReviewEntity } from './review.entity';
import { UserEntity } from './user.entity';
import { PhotoEntity } from './photo.entity';

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

  @Column({ nullable: false, default: false })
  delivery: boolean;

  @Column({ nullable: false })
  delivery_country: string;

  @Column({ nullable: false, default: false })
  refund: boolean;

  @Column({ nullable: false, default: false })
  unpacked: boolean;

  @Column({ nullable: true, default: false })
  is_verified: boolean;

  @Column({ nullable: true, default: false })
  by_owner: boolean;

  @Column({ nullable: true })
  discount_id: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  category_id: string;

  @Column({ nullable: false })
  nested_category_id: string;

  @Column({ nullable: false })
  catalog_id: string;

  @Column({ nullable: true, default: 'false' })
  is_deleted: boolean;

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

  @ManyToOne(() => CatalogEntity, (catalog) => catalog.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'catalog_id' })
  catalog: CatalogEntity;

  @ManyToOne(() => UserEntity, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ProductInfoEntity, (productInfo) => productInfo.product)
  product_infos: ProductInfoEntity[];

  @OneToMany(() => LikeEntity, (like) => like.product)
  likes: LikeEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.product)
  reviews: ReviewEntity[];

  @OneToMany(() => CartEntity, (cart) => cart.product)
  carts: CartEntity[];

  @OneToMany(() => PhotoEntity, (photo) => photo.product)
  photos: PhotoEntity[];
}
