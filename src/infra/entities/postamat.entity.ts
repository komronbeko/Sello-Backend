/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DeliveryEntity } from './delivery.entity';

@Entity({ name: 'postamats' })
export class PostamatEntity extends BaseEntity {
  @Column({ nullable: false })
  branch: string;

  @Column({ nullable: false, })
  address: string;

  @OneToMany(() => DeliveryEntity, delivery => delivery.postamat, {cascade: true})
  deliveries: DeliveryEntity[]
}
