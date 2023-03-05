import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
} from 'typeorm';

@Entity('histories')
export class History extends BaseEntity {
  @Column({ unique: true })
  winner: string;

  @Column({ unique: true })
  loser: string;

  @Column({ unique: true })
  type: string;
}
