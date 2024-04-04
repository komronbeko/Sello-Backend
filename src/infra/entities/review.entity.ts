/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'reviews' })
export class ReviewEntity extends BaseEntity {
  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  product_id: number;

  @Column({nullable: false})
  stars: number;

  @Column({nullable: true})
  commentary: string;

  @ManyToOne(() => UserEntity, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.likes)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
