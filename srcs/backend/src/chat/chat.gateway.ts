import { Socket } from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: [`http://${process.env.NESTJS_HOST}:3000`],
    credentials: true,
  },
})
export class ChatGateway {
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    socket.broadcast.emit('message', { username: socket.id, message });
    return { username: socket.id, message };
  }
}
