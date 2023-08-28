/* eslint-disable prettier/prettier */
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'partners' })
export class PartnerEntity extends BaseEntity {

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  photo: string;
}