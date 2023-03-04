import { Socket } from 'socket.io'

export interface PlayerDto {
  name: string;
  padleX: number;
  padleY: number;
  padleW: number;
  padleH: number;
  padleUp: boolean;
  padleDown: boolean;
  speed: number;
  score: number;
  socket: Socket;
}
