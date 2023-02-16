import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import type { GameDto } from "./dtos/game.dto";
import { gameMod } from "./dtos/game.dto";
import { PlayerDto } from "./dtos/player.dto";

const CanvasWidth = 600;
const CanvasHeight = 400;

@Injectable()
export class GameLogic {

	private init_game(p1: Socket, p2: Socket, roomName: string, GameMod: gameMod): GameDto {
		const params: GameDto = <GameDto>{
			roomName: roomName,
			ball: {
				x: CanvasWidth/2,
				y: CanvasHeight/2,
				radius: 5,
				speed: 5,
				velocityX: 5,
				velocityY: 5
			},
			p1: {
				name: p1.data.user.name,
				padleX: 5,
				padleY: (CanvasHeight - 100)/2,
				padleW: CanvasWidth/60 ,
				padleH: CanvasHeight/4 ,
				score: 0,
				socket: p1,
			},
			p2: {
				name: p2.data.user.name,
				padleX: CanvasWidth - 15,
				padleY: (CanvasHeight - 100)/2,
				padleW: CanvasWidth/60 ,
				padleH: CanvasHeight/4 ,
				score: 0,
				socket: p2,
			},
			gameMod: GameMod,
		}
		return	params;
	}

	private resetBall(GameDto: GameDto) {
		GameDto.ball.x = CanvasWidth/2;
		GameDto.ball.y = CanvasHeight/2;
		GameDto.ball.speed = 5;
		GameDto.ball.velocityX = -GameDto.ball.velocityX;
	}

	private collision(GameDto: GameDto, player: PlayerDto): boolean {
		const player_top = player.padleY;
		const player_bottom = player.padleY + player.padleH;
		const player_left = player.padleX;
		const player_right = player.padleX + player.padleW;
	
		const ball_top = GameDto.ball.y - GameDto.ball.radius;
		const ball_bottom = GameDto.ball.y + GameDto.ball.radius;
		const ball_left = GameDto.ball.x - GameDto.ball.radius;
		const ball_right = GameDto.ball.x + GameDto.ball.radius;
		
		return (ball_right > player_left && ball_top < player_bottom && 
			ball_left < player_right && ball_bottom > player_top);
	}

	private update(Game: GameDto) {
		// ready 확인 추가 자리
		if (Game.ball.x - Game.ball.radius < 0) {
			Game.p2.score++;
			this.resetBall(Game);
		}
		else if (Game.ball.x + Game.ball.radius > CanvasWidth) {
			Game.p1.score++;
			this.resetBall(Game);
		}

		Game.ball.x += Game.ball.velocityX;
		Game.ball.y += Game.ball.velocityY;
		// soloMod
		// if (Game.gameMod === gameMod.soloGame)
			Game.p2.padleY += ((Game.ball.y - (Game.p2.padleY + Game.p2.padleH/2)))*0.1;
		const player = (Game.ball.x + Game.ball.radius < CanvasWidth/2) ? Game.p1 : Game.p2;
		if (this.collision(Game, player)) {
			let collidePoint = (Game.ball.y - (player.padleY + player.padleH/2));
			collidePoint = collidePoint / (player.padleH/2);
			const angleRad = (Math.PI/4) * collidePoint;
			const direction = (Game.ball.x + Game.ball.radius < CanvasWidth/2) ? 1 : -1;
			Game.ball.velocityX = direction * Game.ball.speed * Math.cos(angleRad);
			Game.ball.velocityY = Game.ball.speed * Math.sin(angleRad);
			Game.ball.speed += 1;
		}
	}

	// private getClientGame(client: Socket): GameDto {
	// 	for (const room of client.rooms) {
	// 		const tmp: GameDto = this.currentMatch.get(room);
			
	// 	}
	// }

	private gameLoop(client: Socket) {
		const game: GameDto = this.getClientGame(client);
		// setInterval(() => this.update(game), 1000/60;
		requestAnimationFrame(() => this.update(game));
	}
}