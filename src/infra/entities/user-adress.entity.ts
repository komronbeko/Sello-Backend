/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';
import { DeliveryEntity } from './delivery.entity';

@Entity({ name: 'user_addresses' })
export class UserAddressEntity extends BaseEntity {
  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  district: string;

  @Column({ nullable: false })
  street: string;

  @Column({ nullable: false })
  apartment: string;

  @Column({ nullable: false })
  zip_code: string;

  @Column({ nullable: false })
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.userAddresses)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  
  @OneToMany(() => DeliveryEntity, delivery => delivery.user_address, {cascade: true})
  deliveries: DeliveryEntity[]
}
