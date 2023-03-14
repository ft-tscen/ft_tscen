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
import { IsInt, IsBoolean, IsString } from 'class-validator';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  intra: string;

  @Column()
  @IsString()
  usual_full_name: string;

  @Column({ nullable: true, unique: true })
  @IsString()
  nickname?: string;

  @Column({ default: false })
  @IsBoolean()
  verified: boolean;

  @Column({ nullable: true })
  @IsString()
  phone?: string;

  @Column({ nullable: true, select: false })
  @IsString()
  code?: string;

  @Column({ default: 0, nullable: true })
  @IsInt()
  f_win: number;

  @Column({ default: 0, nullable: true })
  @IsInt()
  f_lose: number;

  @Column({ default: 0, nullable: true })
  @IsInt()
  r_win: number;

  @Column({ default: 0, nullable: true })
  @IsInt()
  r_lose: number;

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => Avatar, { nullable: true, onDelete: 'SET NULL' })
  public avatar?: Avatar;

  @Column({ nullable: true })
  @IsInt()
  public avatarId?: number;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];
}
