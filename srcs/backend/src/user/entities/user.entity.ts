import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

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

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];
}
