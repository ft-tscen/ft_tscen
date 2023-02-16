import { BallDto } from './ball.dto';
import { PlayerDto } from './player.dto';

export enum gameMod{
  normalGame,
  passwordGame,
  soloGame,
  rankGame,
}

export type GameDto = {
  roomName: string,
  ball: BallDto,
  p1: PlayerDto,
  p2: PlayerDto,
  gameMod: gameMod,
}
