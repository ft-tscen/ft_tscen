import { User } from './../user/entities/user.entity';
import { Socket } from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { UserService } from 'src/user/user.service';

// private: 비공개, protected: 비번으로 잠김
export interface ChannelInfo {
  name: string;
  owner: string;            // socket id
  admins: Set<string>;      // socket id
  members: Set<string>;     // socket id
  private: boolean;
  password: string;
  channelMute: Set<string>; // socket id
  banList: Set<string>;     // socket id
}

export interface UserInfo {
  user: User;
  channel: string;
  userMute: Set<string>;     // socket id
}

export interface ChatDto {
  author: string;        // nickname
  target: string;        // nickname or channel name
  message: string;
}

export interface MuteDto {
  channel?: string;         // channel name
  target: string;           // nickname
}

export interface ChannelDto {
  name: string;             // channel name
  password: string;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  channels: Map<string, ChannelInfo> = new Map<string, ChannelInfo>();   // key: channel name
  users: Map<string, UserInfo> = new Map<string, UserInfo>();            // key: socket id
  sockets: Map<string, string> = new Map<string, string>();              // key: nick name, value: socket id

  constructor(private readonly userService: UserService) {}

  afterInit() {
    this.channels.clear();
    this.users.clear();
    this.sockets.clear();

    console.log('웹소켓 서버 초기화 ✅');
  }

  // 처음 접속시 user에 추가
  async handleConnection(@ConnectedSocket() socket: Socket) {
    const { nickname } = socket.handshake.query;
  
    // 중복 접속 불허
    if (typeof nickname === 'string' && !this.users.has(nickname)) {
      const { user } = await this.userService.getUserByNickName(nickname);
      this.users.set(socket.id, {user, channel: socket.id, userMute: new Set<string>()});
      this.sockets.set(nickname, socket.id);
      console.log(`${socket.id} 소켓 연결`);
    } else {
      socket.disconnect();
    }
  }

  // 연결 끊길때 user에서 제거
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const { nickname } = socket.handshake.query;
  
    if (typeof nickname === 'string' && this.sockets.has(nickname)) {
      this.users.delete(socket.id);
      this.sockets.delete(nickname);
      this.channels.forEach((channel) => {
        this.part(channel.name, socket.id);
      });
    }
    console.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  @SubscribeMessage('channel-list')
  handleChannelList() {
    return Array.from(this.channels.keys());
  }

  @SubscribeMessage('channel-msg')
  handleChannelMsg(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chat: ChatDto,
  ) {
    const { author, target } = chat;
    const { user } = this.users.get(this.sockets.get(author));

    if (this.channels.has(target)) {
      const { members, channelMute } = this.channels.get(target);
      members.forEach((member) => {
        const { userMute } = this.users.get(member);
        if (!channelMute.has(author) && !userMute.has(author)) {
          socket.to(member).emit('channel-msg', {user, ...chat});
        }
      })
    }
    return {user, ...chat};
  }

  @SubscribeMessage('channel-mute')
  muteByChannel(@ConnectedSocket() socket: Socket, @MessageBody() { channel, target }: MuteDto) {
    if (this.channels.has(channel)) {
      const cn = this.channels.get(channel);
      if (cn.owner === socket.id || cn.admins.has(socket.id)) {
        cn.channelMute.add(this.sockets.get(target));
        return true;
      }
    }
    return false;
  }

  @SubscribeMessage('channel-unmute')
  unmuteByChannel(@ConnectedSocket() socket: Socket, @MessageBody() { channel, target }: MuteDto) {
    if (this.channels.has(channel)) {
      const cn = this.channels.get(channel);
      if (cn.owner === socket.id || cn.admins.has(socket.id)) {
        cn.channelMute.delete(this.sockets.get(target));
        return true;
      }
    }
    return false;
  }

  @SubscribeMessage('direct-msg')
  handleDirectMsg(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chat: ChatDto,
  ) {
    const { author, target } = chat;
    const { user } = this.users.get(this.sockets.get(author));

    if (this.sockets.has(target)) {
      const { userMute } = this.users.get(this.sockets.get(target));
      if (!userMute.has(author)) {
          socket.to(author).emit('direct-msg', {user, ...chat});
        }
    }
    return {user, ...chat};
  }

  @SubscribeMessage('direct-mute')
  muteByUser(@ConnectedSocket() socket: Socket, @MessageBody() { target }: MuteDto) {
    if (this.users.has(socket.id)) {
      this.users.get(socket.id).userMute.add(this.sockets.get(target));
      return true;
    }
    return false;
  }

  @SubscribeMessage('direct-unmute')
  unmuteByUser(@ConnectedSocket() socket: Socket, @MessageBody() { target }: MuteDto) {
    if (this.users.has(socket.id)) {
      this.users.get(socket.id).userMute.delete(this.sockets.get(target));
      return true;
    }
    return false;
  }

  @SubscribeMessage('join-channel')
  joinChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { name, password }: ChannelDto,
  ) {
    if (this.channels.has(name)) {
      const channel = this.channels.get(name);
      if (!channel.banList.has(socket.id) && channel.password === password) {
        channel.members.add(socket.id);
      }
    } else {
      const admins = new Set<string>();
      const members = new Set<string>();
      const banList = new Set<string>();
      admins.add(socket.id);
      members.add(socket.id);
      this.channels.set(name, {name: name, owner: socket.id, admins, members, banList, private: false, password: '', channelMute: new Set<string>()})
    }
    const user = this.users.get(socket.id);
    this.part(user.channel, socket.id);
    user.channel = name;
  }

  @SubscribeMessage('leave-channel')
  leaveChannel(
    @ConnectedSocket() socket: Socket,
  ) {
    const user = this.users.get(socket.id);
    this.part(user.channel, socket.id);
    user.channel = socket.id;
  }

  part(channelName: string, userSocket: string) {
    if (channelName && this.channels.has(channelName)) {
      const channel = this.channels.get(channelName);

      channel.admins.delete(userSocket);
      channel.members.delete(userSocket);
      if (userSocket === channel.owner) {
        if (channel.admins.size > 0) {
          channel.owner = channel.admins.values().next().value;
        } else if (channel.members.size > 0) {
          channel.owner = channel.members.values().next().value;
        } else {
          this.channels.delete(channelName);
        }
      }
    }
  }

  checkOwner(userSocket: string, channel: string) {
    if (this.channels.has(channel)) {
      const { owner, admins } = this.channels.get(channel);
      if (userSocket === owner ) {
        return true;
      }
    }
    return false;
  }

  checkAdmin(userSocket: string, channel: string) {
    if (this.channels.has(channel)) {
      const { owner, admins } = this.channels.get(channel);
      if (userSocket === owner || admins.has(userSocket)) {
        return true;
      }
    }
    return false;
  }

  authorizeUser(userSocket: string, channel: string, target: string) {
    if (this.checkOwner(userSocket, channel)) {
      this.channels.get(channel).admins.add(this.sockets.get(target));
    }
  }

  unauthorizeUser(userSocket: string, channel: string, target: string) {
    if (this.checkOwner(userSocket, channel)) {
      this.channels.get(channel).admins.delete(this.sockets.get(target));
    }
  }

  kickUser(userSocket: string, channel: string, target: string) {
    if (this.sockets.has(target)) {
      const targetSocket = this.sockets.get(target);
      if (this.checkAdmin(userSocket, channel) && !this.checkAdmin(targetSocket, channel)) {
        this.part(channel, targetSocket);
        this.users.get(targetSocket).channel = targetSocket;
      }
    }  
  }

  banUser(userSocket: string, channel: string, target: string) {
    if (this.sockets.has(target)) {
      const targetSocket = this.sockets.get(target);
      if (this.checkAdmin(userSocket, channel) && !this.checkAdmin(targetSocket, channel)) {
      this.channels.get(channel).banList.add(this.sockets.get(target));
      }
    }
  }

  unbanUser(userSocket: string, channel: string, target: string) {
    if (this.sockets.has(target)) {
      const targetSocket = this.sockets.get(target);
      if (this.checkAdmin(userSocket, channel) && !this.checkAdmin(targetSocket, channel)) {
      this.channels.get(channel).banList.delete(this.sockets.get(target));
      }
    }
  }

  setPassword(userSocket: string, channel: string, password: string) {
    if (this.checkOwner(userSocket, channel)) {
      this.channels.get(channel).password = password;
    }
  }

  setPrivate(userSocket: string, channel: string) {
    if (this.checkOwner(userSocket, channel)) {
      this.channels.get(channel).private = true;
    }
  }

  unsetPrivate(userSocket: string, channel: string) {
    if (this.checkOwner(userSocket, channel)) {
      this.channels.get(channel).private = false;
    }
  }

}
