import { BallDto } from './ball.dto';
import { PlayerDto } from './player.dto';

export interface GameDto {
  roomName: string;
  ball: BallDto;
  p1: PlayerDto;
  p2: PlayerDto;
}
