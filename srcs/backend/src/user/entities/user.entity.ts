import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import Avatar from './avatar.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  intra: string;

  @Column()
  usual_full_name: string;

  @Column({ nullable: true, unique: true })
  nickname?: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true, select: false })
  code?: string;

  @Column({ default: 0, nullable: true })
  f_win: number;

  @Column({ default: 0, nullable: true })
  f_lose: number;

  @Column({ default: 0, nullable: true })
  r_win: number;

  @Column({ default: 0, nullable: true })
  r_lose: number;

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => Avatar, { nullable: true, onDelete: 'SET NULL', })
  public avatar?: Avatar;

  @Column({ nullable: true })
  public avatarId?: number;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];
}
