import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'photo' })
export class PhotoEntity extends BaseEntity {
  @Column({ nullable: false })
  path: string;

  @Column({ nullable: false })
  product_id: string;

  @ManyToOne(() => ProductEntity, (product) => product.photos, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity[];
}
