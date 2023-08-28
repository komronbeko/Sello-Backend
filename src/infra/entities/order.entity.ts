/* eslint-disable prettier/prettier */
// import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
// import { UserEntity } from './user.entity';
// import { ProductEntity } from './product.entity';

// @Entity({ name: 'orders' })
// export class OrderEntity extends BaseEntity {
//   @ManyToOne(() => UserEntity, (user) => user.orders)
//   @JoinColumn({ name: 'user_id' })
//   user: UserEntity;

//   @ManyToOne(() => ProductEntity, (product) => product.orders)
//   @JoinColumn({ name: 'product_id' })
//   product: ProductEntity;

//   @Column({ nullable: false })
//   status: string;

//   @Column({ nullable: false })
//   delivery_cost: number;
// }