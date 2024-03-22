import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DeliveryEntity } from './delivery.entity';

@Entity({ name: 'locations' })
export class LocationEntity extends BaseEntity {
  @Column()
  branch_id: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  working_hours: string;

  @OneToMany(() => DeliveryEntity, (delivery) => delivery.location, {
    cascade: true,
  })
  deliveries: DeliveryEntity[];
}
