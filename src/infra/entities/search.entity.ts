/* eslint-disable prettier/prettier */
import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'search' })
export class SearchEntity extends BaseEntity {
  @Column({ nullable: false })
  value: string;
}
