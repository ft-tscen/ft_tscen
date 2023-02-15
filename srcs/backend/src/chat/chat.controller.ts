import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Get('/rooms')
  getRoomList() {
    return ;
  }
}
