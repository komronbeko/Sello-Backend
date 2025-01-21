import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CatalogEntity } from './catalog.entity';
import { NestedCategoryEntity } from './nested-category.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  catalog_id: string;

  @ManyToOne(() => CatalogEntity, (catalog) => catalog.categories)
  @JoinColumn({ name: 'catalog_id' })
  catalog: CatalogEntity;

  @OneToMany(
    () => NestedCategoryEntity,
    (nestedCategory) => nestedCategory.category,
    { cascade: true },
  )
  nestedCategories: NestedCategoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.category, {
    cascade: true,
  })
  products: ProductEntity[];
}
