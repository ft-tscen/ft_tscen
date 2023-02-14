import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GamesGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  providers: [GameService, GamesGateway],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
