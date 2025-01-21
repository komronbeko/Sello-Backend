import { Column, Entity } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product-hisotory' })
export class ProductHistoryEntity extends ProductEntity {
  @Column({ nullable: false })
  original_product_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  deleted_at: Date;

  @Column({ nullable: false })
  deleted_by: string;
}
