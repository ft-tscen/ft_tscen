import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  intra: string;

  @Column()
  usual_full_name: string;

  @Column({ nullable: true })
  nickname?: string;
}
