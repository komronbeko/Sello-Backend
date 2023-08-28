/* eslint-disable prettier/prettier */
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'admins' })
export class AdminEntity extends BaseEntity {
  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: 'admin', nullable: true })
  role: string;
} 
