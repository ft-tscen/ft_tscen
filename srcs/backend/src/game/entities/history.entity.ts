import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { gameMod } from 'src/game/dtos/game.dto';
import { IsInt, IsUUID, IsEnum } from 'class-validator';

@Entity('histories')
export class History extends BaseEntity {
  @Column({ unique: true })
  @IsUUID()
  gameId: string;

  @Column()
  @IsInt()
  winner: number;

  @Column()
  @IsInt()
  loser: number;

  @Column()
  @IsEnum(gameMod)
  type: gameMod;
}
