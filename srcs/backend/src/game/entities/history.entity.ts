import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
} from 'typeorm';
import { gameMod } from 'src/game/dtos/game.dto';

@Entity('histories')
export class History extends BaseEntity {
  @Column()
  winner: number;

  @Column()
  loser: number;

  @Column()
  type: gameMod;
}
