import { Logger, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { GameDto } from './dtos/game.dto';
import { GameService } from './game.service'

class gameInfo {
	roomName: string;
	gameDto: GameDto;
}

let createdRooms: string[] = [];
let gameInfos: gameInfo[] = [];

@ApiResponse({
  status: 200,
  description: 'returns game config',
})
@ApiResponse({ status: 403, description: 'Forbidden.' })
@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: ['http://localhost:3000'],
	},
})
export class GamesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
//  constructor (private gameService: GameService, private gameDto: GameDto) {}
  private logger = new Logger('Game Gateway');

  @WebSocketServer() nsp: Namespace;

  afterInit() {
    this.nsp.adapter.on('delete-room', (room) => {
      const deletedRoom = createdRooms.find(
        (createdRoom) => createdRoom === room,
      );
      if (!deletedRoom) return;

      this.nsp.emit('delete-room', deletedRoom);
      createdRooms = createdRooms.filter(
        (createdRoom) => createdRoom !== deletedRoom,
      ); // 유저가 생성한 room 목록 중에 삭제되는 room 있으면 제거
    });

    this.logger.log('+=+=+=+=+=+= WebSever init Success +=+=+=+=+=+=');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} Socket Connected`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} -=-=-=-=-=-= Socket Disconnected -=-=-=-=-=-=`);
  }

  @SubscribeMessage('test')
  handleTest(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id}: test success!`);
    socket.emit('test', `${socket.id}: test success!`);
  }

//  @SubscribeMessage('up')
//  handleUp(
//    @ConnectedSocket() socket: Socket
//  ) {
//
//
//  }

//  @SubscribeMessage('down')
//  handleDown(
//    @ConnectedSocket() socket: Socket
//  ) {
//
//
//  }

//  @SubscribeMessage('stop')
//  handleStop(
//    @ConnectedSocket() socket: Socket
//  ) {
//
//
//  }

  @SubscribeMessage('room-list')
  handleRoomList() {
    return createdRooms;
  }

  @SubscribeMessage('ready-game')
  handleStartGame() {

   // if (모든 플레이어 준비 완료시)
   //   this->gameService->gameStart();
   // else
   //   ready_flag = true;

  }

  @SubscribeMessage('create-room')
  handleCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    const exists = createdRooms.find((createdRoom) => createdRoom === roomName);
    if (exists) {
      return { success: false, payload: `${roomName} room already existed!` };
    }

    socket.join(roomName); // 기존에 없던 room으로 join하면 room이 생성됨
    createdRooms.push(roomName); // 유저가 생성한 room 목록에 추가
    this.nsp.emit('create-room', roomName); // 대기실 방 생성

    return { success: true, payload: roomName };
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    socket.join(roomName); // join room
    socket.broadcast
      .to(roomName)
      .emit('message', { message: `${socket.id} join room!` });

    return { success: true };
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    socket.leave(roomName); // leave room
    socket.broadcast
      .to(roomName)
      .emit('message', { message: `${socket.id} out room!` });

    return { success: true };
  }
}
