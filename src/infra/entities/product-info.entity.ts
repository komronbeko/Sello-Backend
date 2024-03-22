import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_infos' })
export class ProductInfoEntity extends BaseEntity {
  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  value: string;

  @Column({ nullable: false })
  product_id: number;

  @ManyToOne(() => ProductEntity, (product) => product.product_infos)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
