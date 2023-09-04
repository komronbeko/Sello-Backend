/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { CartEntity } from './cart.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'orders' })
export class OrderEntity extends BaseEntity {
  @Column({ nullable: false})
  cost: number;

  @Column({ nullable: false }) 
  secret_code: string;

  @Column({ nullable: false, default: 'new' })
  status: string;

  @Column({ nullable: false })
  location: string;

  @Column({ nullable: false })
  user_id: number;

  @OneToMany(() => CartEntity, (cart) => cart.order, { cascade: true })
  carts: CartEntity[];

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
