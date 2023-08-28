/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';

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
  zip_code: number;

  @Column({ nullable: false })
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.userAddresses)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
