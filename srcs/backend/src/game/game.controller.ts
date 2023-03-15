import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/authUser.decorator';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GameService } from './game.service';
import { gameMod } from './dtos/game.dto';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'search history by nickname',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('/history')
  async getHistory(
    @Query('nickname') nickname: string,
  ) {
	  return await this.gameService.getHistory(nickname);
  }
}
