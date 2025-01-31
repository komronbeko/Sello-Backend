import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BannerEntity } from './banner.entity';
import { CategoryEntity } from './category.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'catalogs' })
export class CatalogEntity extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @OneToMany(() => BannerEntity, (banners) => banners.catalog, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  banners: BannerEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.catalog, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  categories: CategoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.catalog, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  products: ProductEntity[];
}
