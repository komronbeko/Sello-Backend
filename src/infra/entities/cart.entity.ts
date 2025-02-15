import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'carts' })
export class CartEntity extends BaseEntity {
  @Column({ nullable: false, default: true })
  is_active: boolean;

  @Column({ nullable: false, default: 'unpaid' })
  status: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: true })
  product_id: string;

  @Column({ nullable: false, default: 0 })
  count: number;

  @Column({ nullable: true })
  order_id: string;

  @ManyToOne(() => UserEntity, (user) => user.carts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.carts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => OrderEntity, (order) => order.carts)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  // @OneToMany(() => OrderEntity, (order) => order.cart)
  // orders: OrderEntity[];
}
