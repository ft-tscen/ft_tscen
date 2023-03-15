import { IsBoolean, IsNumber, IsString } from 'class-validator';
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
  @IsString()
  @Column({ unique: true })
  intra: string;

  @IsString()
  @Column()
  usual_full_name: string;

  @IsString()
  @Column({ nullable: true, unique: true })
  nickname?: string;

  @IsBoolean()
  @Column({ default: false })
  verified: boolean;

  @IsString()
  @Column({ nullable: true })
  phone?: string;

  @IsString()
  @Column({ nullable: true, select: false })
  code?: string;

  @IsNumber()
  @Column({ default: 0, nullable: true })
  f_win: number;

  @IsNumber()
  @Column({ default: 0, nullable: true })
  f_lose: number;

  @IsNumber()
  @Column({ default: 0, nullable: true })
  r_win: number;

  @IsNumber()
  @Column({ default: 0, nullable: true })
  r_lose: number;

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => Avatar, { nullable: true, onDelete: 'SET NULL', })
  public avatar?: Avatar;

  @IsNumber()
  @Column({ nullable: true })
  public avatarId?: number;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];
}
