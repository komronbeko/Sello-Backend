/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany} from 'typeorm';
import { BaseEntity } from './base.entity';
import { BannerEntity } from './banner.entity';
import { CategoryEntity } from './category.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'catalogs' })
export class CatalogEntity extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @OneToMany(()=> BannerEntity, banners => banners.catalog)
  banners: BannerEntity[]

  @OneToMany(()=> CategoryEntity, category => category.catalog)
  categories: CatalogEntity[];

  @OneToMany(() => ProductEntity, (product) => product.catalog)
  products: ProductEntity[];
}

