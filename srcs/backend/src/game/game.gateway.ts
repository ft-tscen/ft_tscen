import { Logger, Query, UseGuards } from '@nestjs/common';
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
import { subscribeOn } from 'rxjs';
import { Namespace, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { GameDto, gameMod } from './dtos/game.dto';
import { GameService } from './game.service';

//export class GameRoom {
//  nsp: Namespace;
//  roomName: string;
//  p1Ready: boolean;
//  p2Ready: boolean;
//  gameDto: GameDto;
//}

export interface WaitingPlayer {
	waiting: boolean,
	socket: Socket,
	nickname: string,
}

let createdRooms: string[] = [];

//const gameRooms = new Map<string, GameDto>();
const GameDtoByRoomName = new Map<string, GameDto>();
const RoomNameBySocketId = new Map<string, string>();
const NicknameBySocketId = new Map<string, string>();

//const gameQueue: MyQueue = new MyQueue();
let waitingSocket: Socket = undefined;
const waitingPlayer: WaitingPlayer = {
	waiting: false,
	socket: undefined,
	nickname: undefined,
};

@ApiResponse({
  status: 200,
  description: 'returns game config',
})
@ApiResponse({ status: 403, description: 'Forbidden.' })
@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: [`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`],
    credentials: true,
  },
})
export class GamesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private gameService: GameService) {}
  private logger = new Logger('Game Gateway');

  @WebSocketServer() nsp: Namespace;

  afterInit() {
    this.nsp.adapter.on('delete-room', (roomName) => {
		this.logger.log(`${roomName} deleted!!!`);
		const deletedRoom = createdRooms.find(
			(createdRoom) => createdRoom === roomName,
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
	//const { nickname } = socket.handshake.query;
	//this.logger.log(socket.handshake);
	//this.logger.log(test);
	//NicknameBySocketId[socket.id] = nickname;

	//if (NicknameBySocketId[socket.id] == undefined)
	//	NicknameBySocketId[socket.id] = socket.id;

	this.logger.log(`${socket.id} +=+=+=+=+=+= Socket Connected +=+=+=+=+=+=`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
	if (NicknameBySocketId[socket.id]) {
		this.logger.log(`${socket.id} (${NicknameBySocketId[socket.id]}) -=-=-=-=-=-= Socket Disconnected -=-=-=-=-=-=`,);
		NicknameBySocketId.delete(socket.id);
	}
	else
		this.logger.log(`${socket.id} -=-=-=-=-=-= Socket Disconnected -=-=-=-=-=-=`,);

	const roomName  = RoomNameBySocketId[socket.id];
	const gameDto = GameDtoByRoomName[roomName];

	if (roomName && gameDto) {
		if (gameDto.p1.socket.id != socket.id)
			this.gameService.finishGame(gameDto, true)
		else
			this.gameService.finishGame(gameDto, false)
	}
	if (waitingPlayer.socket && socket.id == waitingPlayer.socket.id)
		waitingPlayer.waiting = false;

  }

  @SubscribeMessage('nickname')
  handleNickname(@ConnectedSocket() socket: Socket, @MessageBody() nickname: string) {
	this.logger.log(`Nickname Registration ${nickname}`);
	NicknameBySocketId[socket.id] = nickname;
  }

  @SubscribeMessage('test')
  handleTest(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id}: test success!`);
    const Game: GameDto = this.gameService.init_test(
      socket,
      'test',
      gameMod.soloGame,
    );
    GameDtoByRoomName[Game.roomName] = Game;
    RoomNameBySocketId[socket.id] = Game.roomName;
    this.gameService.gameLoop(GameDtoByRoomName[Game.roomName]);

    socket.emit('test', `${socket.id}: test success!`);
  }

  @SubscribeMessage('PaddleUp')
  handlePaddleUp(@ConnectedSocket() socket: Socket, @MessageBody() is_p1: boolean) {
    const na = RoomNameBySocketId[socket.id];
    const dto: GameDto = GameDtoByRoomName[na];
	this.logger.log(`player1 ${is_p1}`);
    if (is_p1)
		dto.p1.padleUp = true;
	else
		dto.p2.padleUp = true;
    //this.logger.log('up');
  }

  @SubscribeMessage('PaddleDown')
  handlePaddleDown(@ConnectedSocket() socket: Socket, @MessageBody() is_p1: boolean) {
    const na = RoomNameBySocketId[socket.id];
    const dto: GameDto = GameDtoByRoomName[na];
	if (is_p1)
    	dto.p1.padleDown = true;
	else
    	dto.p2.padleDown = true;
    //this.logger.log('down');
  }

  @SubscribeMessage('PaddleStop')
  handlePaddleStop(@ConnectedSocket() socket: Socket, @MessageBody() is_p1: boolean) {
    const na = RoomNameBySocketId[socket.id];
    const dto: GameDto = GameDtoByRoomName[na];
	if (!dto)
		return;
	if (is_p1) {
		dto.p1.padleUp = false;
		dto.p1.padleDown = false;
	}
	else {
		dto.p2.padleUp = false;
		dto.p2.padleDown = false;
	}
  }

  @SubscribeMessage('room-list')
  handleRoomList() {
    return createdRooms;
  }

  @SubscribeMessage('friendly-match')
  handleFriendlyMatching(@ConnectedSocket() socket: Socket,
  @MessageBody() roomName: string) {
	//if ()
  }

  @SubscribeMessage('matching')
  handleMatching(@ConnectedSocket() socket: Socket) {
	//this.logger.log('matching');
	const nickname = NicknameBySocketId[socket.id];

	if (waitingPlayer.waiting) {
		if (nickname == waitingPlayer.nickname)
			return;

		const roomName = waitingPlayer.nickname + nickname;
		const Game: GameDto = this.gameService.init_game(
			waitingPlayer.socket,  // p1
			waitingPlayer.nickname,
			roomName, // roomName
			gameMod.rankGame, // game mod
			this.nsp,
		);
		Game.p2.name = socket.id;
		Game.p2.socket = socket;
		GameDtoByRoomName[roomName] = Game;

		createdRooms.push(roomName); // 유저가 생성한 room 목록에 추가

		RoomNameBySocketId[waitingPlayer.socket.id] = roomName;
		RoomNameBySocketId[socket.id] = roomName;

		socket.join(roomName); // 기존에 없던 room으로 join하면 room이 생성됨
		waitingPlayer.socket.join(roomName); // 기존에 없던 room으로 join하면 room이 생성됨

		this.nsp.emit('matching-success'); // 대기실 방 생성을 연결된 클라들에게 알림
		this.logger.log('matching success!!!');

		waitingPlayer.waiting = false;
		//this.nsp.to(roomName).emit('message', { message: `${wait_socket.id} join room!` });
	}
	else {
		waitingPlayer.nickname = nickname;
		waitingPlayer.socket = socket;
		waitingPlayer.waiting = true;
		this.logger.log(`${socket.id} matching waiting...`);
	}
  }

  @SubscribeMessage('ready-rank')
  handleReadyRank(@ConnectedSocket() socket: Socket) {
	const roomName = RoomNameBySocketId[socket.id];
	//if (!roomName)  // 여기 조건문 달아서 중복 호출 막음
	//	return;
	const game: GameDto = GameDtoByRoomName[roomName];
	if (game.p1Ready === true && game.p2Ready == true)
		return { success: false, payload: `already started!` };

	if (socket.id === game.p1.socket.id) {
		game.p1Ready = true;
		this.logger.log(`Ready p1!!!`);
	}
	else if (socket.id === game.p2.socket.id ){
		game.p2Ready = true;
		this.logger.log(`Ready p2!!!`);
	}

    if (game.p1Ready === true && game.p2Ready == true) {
		game.p1.socket.emit('start-game', true);
		game.p2.socket.emit('start-game', false);
		this.gameService.gameLoop_v2(game);
		this.logger.log(`Game Start!!!`);
    }
    //socket.join(roomName); // 기존에 없던 room으로 join하면 room이 생성됨
    //createdRooms.push(roomName); // 유저가 생성한 room 목록에 추가

    //socket.emit('test', `${socket.id}: test success!`);
  }

  @SubscribeMessage('ready-solo')
  handleReadySolo(@ConnectedSocket() socket: Socket) {
    if (RoomNameBySocketId[socket.id])  // 여기 조건문 달아서 중복 호출 막음
      return;
    this.logger.log(`Ready !!!`);
    const Game: GameDto = this.gameService.init_test(
      socket,
      'roomName',
      gameMod.soloGame,
    );
    GameDtoByRoomName[Game.roomName] = Game;
    RoomNameBySocketId[socket.id] = Game.roomName;

    //socket.join(roomName); // 기존에 없던 room으로 join하면 room이 생성됨
    //createdRooms.push(roomName); // 유저가 생성한 room 목록에 추가

    this.gameService.gameLoop(GameDtoByRoomName[Game.roomName]);
    //socket.emit('test', `${socket.id}: test success!`);
  }

  @SubscribeMessage('end-game')
  handleEndGame(@ConnectedSocket() socket: Socket) {
	const roomName = RoomNameBySocketId[socket.id];
	const gameDto = GameDtoByRoomName[roomName];
	if (roomName && gameDto) {
		RoomNameBySocketId.delete(gameDto.p1.socket.id);
		RoomNameBySocketId.delete(gameDto.p2.socket.id);
		GameDtoByRoomName.delete(roomName);
	}
  }

  @SubscribeMessage('create-room')
  handleCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
    @MessageBody() password: string
  ) {
    const exists = createdRooms.find((createdRoom) => createdRoom === roomName);
    if (exists) {
      return { success: false, payload: `${roomName} room already existed!` };
    }

	const Game: GameDto = this.gameService.init_game(
		socket,  // p1
		NicknameBySocketId[socket.id],
		roomName, // roomName
		gameMod.soloGame, // game mod
		this.nsp,
	);
	if (password) {
		Game.gameMod = gameMod.passwordGame;
		Game.password = password;
	}
	GameDtoByRoomName[roomName] = Game;

    socket.join(roomName); // 기존에 없던 room으로 join하면 room이 생성됨
    createdRooms.push(roomName); // 유저가 생성한 room 목록에 추가
	RoomNameBySocketId[socket.id] = roomName;

    this.nsp.emit('create-room', roomName); // 대기실 방 생성

    return { success: true, payload: roomName };
  }

  @SubscribeMessage('enter-room')
  handleEnterRoom(
	  @ConnectedSocket() socket: Socket,
	  @MessageBody() roomName: string,
	  @MessageBody() password: string,
  ) {
	const exists = createdRooms.find((createdRoom) => createdRoom === roomName);
    if (exists == undefined) {
      return { success: false, payload: `${roomName} not found!` };
    }

	const Game: GameDto =  GameDtoByRoomName[roomName];
	if (Game.gameMod === gameMod.passwordGame && Game.password !== password) {
		return { success: false, payload: `${roomName} password wrong!` };
	}

	socket.join(roomName); // join room
	RoomNameBySocketId[socket.id] = roomName;
	Game.p2.name = socket.id;
	Game.p2.socket = socket;

	this.nsp.emit('matching-success');

	return { success: true, payload: roomName };
  }

  @SubscribeMessage('watch-room')
  handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    socket.join(roomName); // join room
	RoomNameBySocketId[socket.id] = roomName;
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
	RoomNameBySocketId.delete(socket.id);

    //socket.broadcast
    //  .to(roomName)
    //  .emit('message', { message: `${socket.id} out room!` });

    return { success: true };
  }
}
