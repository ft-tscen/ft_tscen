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
  owner: string; // socket id
  admins: Set<string>; // socket id
  members: Set<string>; // socket id
  private: boolean;
  password: string;
  channelMute: Map<string, number>; // socket id
  banList: Map<string, number>; // socket id
}

export interface UserInfo {
  user: User;
  channel: string;
  userMute: Map<string, number>; // socket id
}

export interface SocketInputDto {
  author?: string; // nickname
  target?: string; // nickname or channel name
  message?: string;
  password?: string;
}

export interface SocketOutputDto {
  author?: string; // nickname
  target?: string; // nickname or channel name
  message?: string;
  user?: User;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  channels: Map<string, ChannelInfo> = new Map<string, ChannelInfo>(); // key: channel name
  users: Map<string, UserInfo> = new Map<string, UserInfo>(); // key: socket id
  sockets: Map<string, string> = new Map<string, string>(); // key: nick name, value: socket id

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
      this.users.set(socket.id, {
        user,
        channel: socket.id,
        userMute: new Map<string, number>(),
      });
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
    const channelList = [];

    this.channels.forEach((channel) => {
      const channelObj = {
        name: channel.name,
        hidden: channel.private,
        password: channel.password !== ""
      }
      channelList.push(channelObj);
    })
    console.log("received!");
    return channelList;
  }

  @SubscribeMessage('channel-msg')
  handleChannelMsg(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
  ): SocketOutputDto {
    console.log(input);
    const { author, target } = input;
    //const { user } = this.users.get(this.sockets.get(author));

    if (author !== target) {
      if (this.channels.has(target)) {
        const { members, channelMute } = this.channels.get(target);
        members.forEach((member) => {
          if (member !== socket.id) {
            const now = new Date().getTime();
            if (channelMute.has(author) && now < channelMute.get(author)) {
              return
            }
            const { userMute } = this.users.get(member);
            if (userMute.has(author) && now < userMute.get(author)) {
              return
            }
            socket.to(member).emit('channel-msg', { ...input });
          }
        });
      }
    }
    console.log("send back");
    return { ...input };
  }

  @SubscribeMessage('channel-mute')
  muteByChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
  ): SocketOutputDto {
    const channelName = this.users.get(this.sockets.get(input.author)).channel;
    const channel = this.channels.get(channelName);
    
    if (input.author !== input.target) {
      if (channel.owner === socket.id || channel.admins.has(socket.id)) {
        if (this.sockets.has(input.target) && channel.members.has(input.target)) {
          const validTime = new Date().getTime() + 300_000
          channel.channelMute.set(this.sockets.get(input.target), validTime);
          const output = {
            author: 'server',
            target: input.target,
            message: `${input.target} is muted`,
          };
          socket.broadcast.to(channelName).emit('channel-mute', output);
          return output;
        }
      }
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to mute ${input.target}`,
    };
  }

  @SubscribeMessage('channel-unmute')
  unmuteByChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
  ): SocketOutputDto {
    const channelName = this.users.get(this.sockets.get(input.author)).channel;
    const channel = this.channels.get(channelName);

    if (input.author !== input.target) {
      if (channel.owner === socket.id || channel.admins.has(socket.id)) {
        if (this.sockets.has(input.target) && channel.members.has(input.target)) {
          channel.channelMute.delete(this.sockets.get(input.target));
          const output = {
            author: 'server',
            target: input.target,
            message: `${input.target} is unmuted`,
          };
          socket.broadcast.to(channelName).emit('channel-mute', output);
          return output;
        }
      }
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to unmute ${input.target}`,
    };
  }

  @SubscribeMessage('direct-msg')
  handleDirectMsg(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chat: SocketInputDto,
  ): SocketOutputDto {
    const { author, target } = chat;
    //const { user } = this.users.get(this.sockets.get(author));

    if (author !== target) {
      if (this.sockets.has(target)) {
        const { userMute } = this.users.get(this.sockets.get(target));
        const now = new Date().getTime();
        if (!(userMute.has(author) && now < userMute.get(author))) {
          socket.to(author).emit('direct-msg', { ...chat });
        }
      }
    }
    return { ...chat };
  }

  @SubscribeMessage('direct-mute')
  muteByUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
  ): SocketOutputDto {

    if (input.author !== input.target) {
      if (this.users.has(socket.id) && this.sockets.has(input.target)) {
        const validTime = new Date().getTime() + 300_000
        this.users.get(socket.id).userMute.set(this.sockets.get(input.target), validTime);
        return {
          author: 'server',
          target: input.target,
          message: `${input.target} is muted`,
        };
      }
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to mute ${input.target}`,
    };
  }

  @SubscribeMessage('direct-unmute')
  unmuteByUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
  ): SocketOutputDto {

    if (input.author !== input.target) {
      if (this.users.has(socket.id) && this.sockets.has(input.target)) {
        this.users.get(socket.id).userMute.delete(this.sockets.get(input.target));
        return {
          author: 'server',
          target: input.target,
          message: `${input.target} is unmuted`,
        };
      }
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to unmute ${input.target}`,
    };
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
      return true;
    }
    return false;
  }

  @SubscribeMessage('join-channel')
  joinChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
  ): SocketOutputDto {
    if (this.channels.has(input.target)) {
      const channel = this.channels.get(input.target);
      const now = new Date().getTime();
      if (!(channel.banList.has(socket.id) && now < channel.banList.get(socket.id)) && channel.password === input.password) {
        channel.members.add(socket.id);
      } else {
        return {
          author: 'server',
          target: input.target,
          message: `fails to join channel: ${input.target}`,
        };
      }
    } else {
      const admins = new Set<string>();
      const members = new Set<string>();
      const banList = new Map<string, number>();
      const channelMute = new Map<string, number>();
      admins.add(socket.id);
      members.add(socket.id);
      this.channels.set(input.target, {
        name: input.target,
        owner: socket.id,
        admins,
        members,
        banList,
        private: false,
        password: '',
        channelMute
      });
    }
    const user = this.users.get(socket.id);
    this.part(user.channel, socket.id);
    user.channel = input.target;
    const output = {
      author: 'server',
      target: input.target,
      message: `join channel: ${input.target}`,
    };
    socket.broadcast.to(input.target).emit('join-channel', output);
    return output;
  }

  @SubscribeMessage('leave-channel')
  leaveChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
  ): SocketOutputDto {
    const user = this.users.get(socket.id);
    const leaved = this.part(user.channel, socket.id);
    if (leaved) {
      user.channel = socket.id;
      const output = {
        author: 'server',
        target: input.target,
        message: `leave channel: ${input.target}`,
      };
      socket.broadcast.to(input.target).emit('leave-channel', output);
      return output;
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to leave channel: ${input.target}`,
    };
  }

  checkOwner(userSocket: string, channel: string) {
    if (this.sockets.has(userSocket) && this.channels.has(channel)) {
      const { owner } = this.channels.get(channel);
      if (userSocket === owner) {
        return true;
      }
    }
    return false;
  }

  checkAdmin(userSocket: string, channel: string) {
    if (this.sockets.has(userSocket) && this.channels.has(channel)) {
      const { owner, admins } = this.channels.get(channel);
      if (userSocket === owner || admins.has(userSocket)) {
        return true;
      }
    }
    return false;
  }

  @SubscribeMessage('authorize')
  authorizeUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
  ): SocketOutputDto {
    const channel = this.users.get(socket.id).channel;

    if (input.author !== input.target) {
      if (this.checkOwner(socket.id, channel) && this.sockets.has(input.target)) {
        this.channels.get(channel).admins.add(this.sockets.get(input.target));
        const output = {
          author: 'server',
          target: input.target,
          message: `${input.target} is admin now`,
        };
        socket.broadcast.to(channel).emit('authorize', output);
        return output;
      }
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to authorize ${input.target}`,
    };
  }

  @SubscribeMessage('deauthorize')
  unauthorizeUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
  ): SocketOutputDto {
    const channel = this.users.get(socket.id).channel;

    if (input.author !== input.target) {
      if (this.checkOwner(socket.id, channel) && this.sockets.has(input.target)) {
        this.channels.get(channel).admins.add(this.sockets.get(input.target));
        const output = {
          author: 'server',
          target: input.target,
          message: `${input.target} is admin now`,
        };
        socket.broadcast.to(channel).emit('deauthorize', output);
        return output;
      }
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to deauthorize ${input.target}`,
    };
  }

  @SubscribeMessage('kick')
  kickUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
    userSocket: string,
    channel: string,
    target: string,
  ): SocketOutputDto {

    if (input.author !== input.target) {
      if (this.sockets.has(target)) {
        const targetSocket = this.sockets.get(target);
        if (
          this.checkAdmin(userSocket, channel) &&
          !this.checkAdmin(targetSocket, channel)
        ) {
          this.part(channel, targetSocket);
          this.users.get(targetSocket).channel = targetSocket;
          const output = {
            author: 'server',
            target: input.target,
            message: `${input.target} is kicked from channel`,
          };
          socket.broadcast.to(channel).emit('kick', output);
          this.banUser(socket, input);
          return output;
        }
      }
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to kick ${input.target} from channel`,
    };
  }

  banUser(socket: Socket, input: SocketInputDto) {
    const channel = this.users.get(socket.id).channel;

    if (input.author !== input.target) {
      if (this.sockets.has(input.target)) {
        const targetSocket = this.sockets.get(input.target);
        if (
          this.checkAdmin(socket.id, channel) &&
          !this.checkAdmin(targetSocket, channel)
        ) {
          const validTime = new Date().getTime() + 300_000
          this.channels.get(channel).banList.set(targetSocket, validTime);
          const output = {
            author: 'server',
            target: input.target,
            message: `${input.target} is banned`,
          };
          socket.broadcast.to(channel).emit('ban', output);
          return output;
        }
      }
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to ban ${input.target}`,
    };
  }

  unbanUser(socket: Socket, input: SocketInputDto) {
    const channel = this.users.get(socket.id).channel;

    if (input.author !== input.target) {
      if (this.sockets.has(input.target)) {
        const targetSocket = this.sockets.get(input.target);
        if (
          this.checkAdmin(socket.id, channel) &&
          !this.checkAdmin(targetSocket, channel)
        ) {
          this.channels.get(channel).banList.delete(targetSocket);
          const output = {
            author: 'server',
            target: input.target,
            message: `${input.target} is unbanned`,
          };
          socket.broadcast.to(channel).emit('unban', output);
          return output;
        }
      }
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to unban ${input.target}`,
    };
  }

  @SubscribeMessage('password')
  setPassword(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
  ): SocketOutputDto {
    const channel = this.users.get(socket.id).channel;
    if (this.checkOwner(socket.id, channel)) {
      this.channels.get(channel).password = input.password;
      const output = {
        author: 'server',
        target: input.target,
        message: `password is set on ${input.target}`,
      };
      socket.broadcast.to(channel).emit('password', output);
      return output;
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to set password on ${input.target}`,
    };
  }

  @SubscribeMessage('private')
  setPrivate(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
  ): SocketOutputDto {
    const channel = this.users.get(socket.id).channel;
    if (this.checkOwner(socket.id, channel)) {
      this.channels.get(channel).private = true;
      const output = {
        author: 'server',
        target: input.target,
        message: `${input.target} is set to private`,
      };
      socket.broadcast.to(channel).emit('private', output);
      return output;
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to private ${input.target}`,
    };
  }

  @SubscribeMessage('deprivate')
  unsetPrivate(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketInputDto,
  ): SocketOutputDto {
    const channel = this.users.get(socket.id).channel;
    if (this.checkOwner(socket.id, channel)) {
      this.channels.get(channel).private = false;
      const output = {
        author: 'server',
        target: input.target,
        message: `${input.target} is set to deprivate`,
      };
      socket.broadcast.to(channel).emit('deprivate', output);
      return output;
    }
    return {
      author: 'server',
      target: input.target,
      message: `fails to deprivate ${input.target}`,
    };
  }
}
