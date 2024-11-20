/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'feedbacks' })
export class FeedbackEntity extends BaseEntity {
  @Column({ nullable: false })
  text: string;

  @Column({ nullable: false })
  user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.feedbacks)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
