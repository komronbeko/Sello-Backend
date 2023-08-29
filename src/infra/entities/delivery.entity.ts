/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PostamatEntity } from './postamat.entity';
import { UserAddressEntity } from './user-adress.entity';
import { LocationEntity } from './location.entity';

@Entity({ name: 'deliveries' })
export class DeliveryEntity extends BaseEntity {

  @Column({ nullable: false })
  method: string;

  @Column({ nullable: false })
  delivery_country: string;

  @Column({nullable: false})
  delivery_date: string;

  @Column({nullable: false})
  user_address_id: number;

  @Column({nullable: false})
  location_id: number;

  @Column({nullable: false})
  postamat_id: number;

  @ManyToOne(() => PostamatEntity, postamat => postamat.deliveries)
  @JoinColumn({name: 'postamat_id'})
  postamat: PostamatEntity;
  
  @ManyToOne(() => UserAddressEntity, user_address => user_address.deliveries)
  @JoinColumn({name: 'user_address_id'})
  user_address: PostamatEntity;

  @ManyToOne(() => LocationEntity, location => location.deliveries)
  @JoinColumn({name: 'location_id'})
  location: PostamatEntity;
}
