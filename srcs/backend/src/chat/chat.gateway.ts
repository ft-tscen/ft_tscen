import { User } from './../user/entities/user.entity';
import { Socket } from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

// private: 비공개, protected: 비번으로 잠김
export interface RoomInfo {
  name: string;
  owner: string;
  admins: string[];
  members: string[];
  private: boolean;
  password: string;
}

export interface UserInfo {
  user: User;
  room: string;
  mute: string[];
}

export interface ChatInputDto {
  author: string;
  target: string;
  message: string;
}

export interface ChatOutputDto {
  author: string;
  target: string;
  message: string;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway {
  rooms: Map<string, RoomInfo> = new Map<string, RoomInfo>();
  users: Map<string, UserInfo> = new Map<string, UserInfo>();
  constructor() {
    this.rooms.clear();
    this.users.clear();
  }

  getRoomList() {
    const roomList = [];
    this.rooms.forEach((room) => {
      roomList.push(room);
    });
    return roomList;
  }

  @SubscribeMessage('channel-msg')
  handleChannelMsg(
    @ConnectedSocket() socket: Socket,
    @MessageBody() messgae: ChatDto,
  ) {
    const { target: channel } = messgae;
    socket.broadcast.to(channel).emit('channel-msg', messgae);
    return messgae;
  }

  @SubscribeMessage('channel-msg')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    socket.broadcast.emit('channel-msg', { username: socket.id, message });
    return { username: socket.id, message };
  }

  @SubscribeMessage('channel-msg')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    socket.broadcast.emit('channel-msg', { username: socket.id, message });
    return { username: socket.id, message };
  }
  @SubscribeMessage('channel-msg')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    socket.broadcast.emit('channel-msg', { username: socket.id, message });
    return { username: socket.id, message };
  }
  @SubscribeMessage('channel-msg')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    socket.broadcast.emit('channel-msg', { username: socket.id, message });
    return { username: socket.id, message };
  }
  @SubscribeMessage('channel-msg')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    socket.broadcast.emit('channel-msg', { username: socket.id, message });
    return { username: socket.id, message };
  }
  @SubscribeMessage('channel-msg')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    socket.broadcast.emit('channel-msg', { username: socket.id, message });
    return { username: socket.id, message };
  }
  @SubscribeMessage('channel-msg')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    socket.broadcast.emit('channel-msg', { username: socket.id, message });
    return { username: socket.id, message };
  }
}
