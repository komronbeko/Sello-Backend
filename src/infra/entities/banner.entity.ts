import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CatalogEntity } from './catalog.entity';

@Entity({ name: 'banners' })
export class BannerEntity extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  catalog_id: number;

  @ManyToOne(() => CatalogEntity, (catalog) => catalog.banners)
  @JoinColumn({ name: 'catalog_id' })
  catalog: CatalogEntity;

  @Column({ nullable: false })
  photo: string;
}
