import { Socket } from 'socket.io'

export interface PlayerDto {
  name: string;
  padleX: number;
  padleY: number;
  padleW: number;
  padleH: number;
  score: number;
  socket: Socket;
}
