/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CartEntity } from './cart.entity';
import { LikeEntity } from './like.entity';
import { NotificationEntity } from './notification.entity';
import { OrderEntity } from './order.entity';
import { UserAddressEntity } from './user-adress.entity';
import { ReviewEntity } from './review.entity';
import { FeedbackEntity } from './feedback.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ nullable: false })
  username: string;

  @Column({ nullable: true })
  f_name: string;

  @Column({ nullable: true })
  l_name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: false })
  is_verified: boolean;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  birthdate: string;

  @Column({ nullable: true })
  money_amount: number;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  gender: string;

  @OneToMany(() => CartEntity, (cart) => cart.user, { cascade: true })
  carts: CartEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user, { cascade: true })
  likes: LikeEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user, { cascade: true })
  reviews: LikeEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user, { cascade: true })
  orders: OrderEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user, {
    cascade: true,
  })
  notifications: NotificationEntity[];

  @OneToMany(() => UserAddressEntity, (userAddress) => userAddress.user, {
    cascade: true,
  })
  userAddresses: UserAddressEntity[];

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.user, {
    cascade: true,
  })
  feedbacks: FeedbackEntity[];

  @OneToMany(() => ProductEntity, (product) => product.user, {
    cascade: true,
  })
  products: ProductEntity[];
}
