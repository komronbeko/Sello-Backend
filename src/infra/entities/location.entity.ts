/* eslint-disable prettier/prettier */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

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
}
