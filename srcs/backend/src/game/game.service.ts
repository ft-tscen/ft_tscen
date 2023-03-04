import { Injectable } from '@nestjs/common';
import { Socket, Namespace } from 'socket.io';
import type { GameDto } from './dtos/game.dto';
import { gameMod } from './dtos/game.dto';
import { PlayerDto } from './dtos/player.dto';

//  Dto에 필요한 변수 : score, ball_x, ball_velocityX, ball_y, ball_velocityY, left_padle_y, right_padle_y, roomName
// Cluster
const CanvasWidth = 1200;
const CanvasHeight = 800;
// // Laptop
// const CanvasWidth = 600;
// const CanvasHeight = 400;
const VictoryScore = 2;

@Injectable()
export class GameService {
    init_test(p1: Socket, roomName: string, GameMod: gameMod): GameDto {
    const params: GameDto = <GameDto>{
      roomName: roomName,
      ball: {
        x: CanvasWidth / 2,
        y: CanvasHeight / 2,
        radius: CanvasWidth / 60,
        speed: CanvasWidth / 100,
        velocityX: CanvasWidth / 60,
        velocityY: CanvasWidth / 60,
      },
      p1: {
        name: 'user',
        padleX: 5,
        padleY: (CanvasHeight - CanvasHeight / 4) / 2,
        padleW: CanvasWidth / 60,
        padleH: CanvasHeight / 4,
        score: 0,
        padleUp: false,
        padleDown: false,
        speed: CanvasWidth / 80,
        socket: p1,
      },
      p2: {
        name: 'com',
        padleX: CanvasWidth - (CanvasWidth / 60 + 5),
        padleY: (CanvasHeight - CanvasHeight / 4) / 2,
        padleW: CanvasWidth / 60,
        padleH: CanvasHeight / 4,
        score: 0,
        padleUp: false,
        padleDown: false,
        speed: CanvasWidth / 80,
      },
      gameMod: GameMod,
      front: {
        leftPaddle: (CanvasHeight - CanvasHeight / 4) / 2,
        rightPaddle: (CanvasHeight - CanvasHeight / 4) / 2,
        ballX: CanvasWidth / 2,
        ballY: CanvasHeight / 2,
      },
    };
    return params;
  }

  init_game(
    p1: Socket,
	p1NickName: string,
    roomName: string,
    GameMod: gameMod,
	nsp: Namespace,
  ): GameDto {
    const params: GameDto = <GameDto>{
      roomName: roomName,
	  password: undefined,
      ball: {
        x: CanvasWidth / 2,
        y: CanvasHeight / 2,
        radius: CanvasWidth / 60,
        speed: CanvasWidth / 100,
        velocityX: CanvasWidth / 60,
        velocityY: CanvasWidth / 60,
      },
      p1: {
        name: p1NickName,  // 에러나서 임시로 고침
        padleX: 5,
        padleY: (CanvasHeight - CanvasHeight / 4) / 2,
        padleW: CanvasWidth / 60,
        padleH: CanvasHeight / 4,
        score: 0,
        padleUp: false,
        padleDown: false,
        speed: CanvasHeight / 80,
        socket: p1,
      },
      p2: {
        name: undefined,  // 에러나서 임시로 고침
        padleX: CanvasWidth - (CanvasWidth / 60 + 5),
        padleY: (CanvasHeight - CanvasHeight / 4) / 2,
        padleW: CanvasWidth / 60,
        padleH: CanvasHeight / 4,
        score: 0,
        padleUp: false,
        padleDown: false,
        speed: CanvasHeight / 80,
        socket: undefined,
      },
      gameMod: GameMod,
      front: {
        leftPaddle: (CanvasHeight - CanvasHeight / 4) / 2,
        rightPaddle: (CanvasHeight - CanvasHeight / 4) / 2,
        ballX: CanvasWidth / 2,
        ballY: CanvasHeight / 2,
      },
	  p1Ready: false,
	  p2Ready: false,
	  nsp: nsp,
	  interval: undefined,
    };
    return params;
  }

  private resetBall(GameDto: GameDto) {
    GameDto.ball.x = CanvasWidth / 2;
    GameDto.ball.y = CanvasHeight / 2;
    GameDto.ball.speed = CanvasWidth / 100;
    if (GameDto.ball.velocityX > 0)
      GameDto.ball.velocityX = -(CanvasWidth / 100);
    else
      GameDto.ball.velocityX = CanvasWidth / 100;
    GameDto.ball.velocityY = CanvasWidth / 100;
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
    return (
      ball_right > player_left &&
      ball_top < player_bottom &&
      ball_left < player_right &&
      ball_bottom > player_top
    );
  }

  private update(Game: GameDto) {
    // ready 확인 추가 자리 //
    if (Game.ball.x - Game.ball.radius < 0) {
      Game.p2.score++;
      this.resetBall(Game);
    } else if (Game.ball.x + Game.ball.radius > CanvasWidth) {
      Game.p1.score++;
      this.resetBall(Game);
    }
    if (Game.p1.score >= VictoryScore) {
		Game.p1.socket.emit('end-game', true);
    if (Game.p2.socket)
			Game.p2.socket.emit('end-game', false);
		//Game.p2.socket.emit('end-game', false);
		clearInterval(Game.interval);
		return ;
	}
    else if (Game.p2.score >= VictoryScore) {
		//Game.p2.socket.emit('end-game', true);
		Game.p1.socket.emit('end-game', false);
    if (Game.p2.socket)
			Game.p2.socket.emit('end-game', true);
		clearInterval(Game.interval);
		return ;
	}
    // 패들 계산
    this.paddleCalculate(Game);
    // 공 계산
    Game.ball.x += Game.ball.velocityX;
    Game.ball.y += Game.ball.velocityY;
    // soloMod
    // if (Game.gameMod === gameMod.soloGame)
    Game.p2.padleY +=
      (Game.ball.y - (Game.p2.padleY + Game.p2.padleH / 2)) * 0.1;
    const player =
      Game.ball.x + Game.ball.radius < CanvasWidth / 2 ? Game.p1 : Game.p2;
    //  if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height)
    //	ball.velocityY = -ball.velocityY;
    if (
      Game.ball.y + Game.ball.radius < 0 ||
      Game.ball.y + Game.ball.radius > CanvasHeight
    )
      Game.ball.velocityY = -Game.ball.velocityY;
    if (this.collision(Game, player)) {
      let collidePoint = Game.ball.y - (player.padleY + player.padleH / 2);
      collidePoint = collidePoint / (player.padleH / 2);
      let angleRad = (Math.PI / 4) * collidePoint;
      let direction =
        Game.ball.x + Game.ball.radius < CanvasWidth / 2 ? 1 : -1;
      Game.ball.velocityX = direction * Game.ball.speed * Math.cos(angleRad);
      Game.ball.velocityY = Game.ball.speed * Math.sin(angleRad);
      Game.ball.speed += 1;
    }
    Game.front.leftPaddle = Game.p1.padleY;
    Game.front.rightPaddle = Game.p2.padleY;
    Game.front.ballX = Game.ball.x;
    Game.front.ballY = Game.ball.y;
    Game.front.leftScore = Game.p1.score;
    Game.front.rightScore = Game.p2.score;
    // render 호출하는 socket 추가
    Game.p1.socket.emit('update', Game.front);
  }

  private update_v2(Game: GameDto) {
    // ready 확인 추가 자리 //
	if (Game.ball.x - Game.ball.radius < 0) {
		Game.p2.score++;
		this.resetBall(Game);
	} else if (Game.ball.x + Game.ball.radius > CanvasWidth) {
		Game.p1.score++;
		this.resetBall(Game);
	}
	if (Game.p1.score >= VictoryScore) {
		Game.p1.socket.emit('end-game', true);
		if (Game.p2.socket)
			Game.p2.socket.emit('end-game', false);
		Game.p2.socket.emit('end-game', false);
		//clearInterval(Game.interval);
		this.finishGame(Game, true);
		return ;
	}
	else if (Game.p2.score >= VictoryScore) {
		//Game.p2.socket.emit('end-game', true);
		//Game.p1.socket.emit('end-game', false);
		//if (Game.p2.socket)
		//	Game.p2.socket.emit('end-game', true);
		//clearInterval(Game.interval);
		this.finishGame(Game, false);
		return ;
	}
    // 패들 계산
    this.paddleCalculate(Game);
    // 공 계산
    Game.ball.x += Game.ball.velocityX;
    Game.ball.y += Game.ball.velocityY;
    // soloMod
     if (Game.gameMod === gameMod.soloGame)
    Game.p2.padleY +=
      (Game.ball.y - (Game.p2.padleY + Game.p2.padleH / 2)) * 0.1;
    const player =
      Game.ball.x + Game.ball.radius < CanvasWidth / 2 ? Game.p1 : Game.p2;
    // if(Game.ball.y - Game.ball.radius < 0 || Game.ball.y + Game.ball.radius > CanvasHeight)
    //  Game.ball.velocityY = -Game.ball.velocityY;
    if (
      Game.ball.y + Game.ball.radius < 0 ||
      Game.ball.y + Game.ball.radius > CanvasHeight
    )
      Game.ball.velocityY = -Game.ball.velocityY;
    if (this.collision(Game, player)) {
      let collidePoint = Game.ball.y - (player.padleY + player.padleH / 2);
      collidePoint = collidePoint / (player.padleH / 2);
      let angleRad = (Math.PI / 4) * collidePoint;
      let direction =
        Game.ball.x + Game.ball.radius < CanvasWidth / 2 ? 1 : -1;
      Game.ball.velocityX = direction * Game.ball.speed * Math.cos(angleRad);
      Game.ball.velocityY = Game.ball.speed * Math.sin(angleRad);
      Game.ball.speed += 1;
    }
    Game.front.leftPaddle = Game.p1.padleY;
    Game.front.rightPaddle = Game.p2.padleY;
    Game.front.ballX = Game.ball.x;
    Game.front.ballY = Game.ball.y;
    Game.front.leftScore = Game.p1.score;
    Game.front.rightScore = Game.p2.score;
    // render 호출하는 socket 추가
	  Game.nsp.to(Game.roomName).emit('update', Game.front);
  }

  paddleUp(client: Socket, Game: GameDto) {
	if (client.id === Game.p1.socket.id)
    	Game.p1.padleUp = true;
	else
    	Game.p2.padleUp = true;
  }

  paddleDown(client: Socket, Game: GameDto) {
	if (client.id === Game.p1.socket.id)
		Game.p1.padleDown = true;
	else
		Game.p2.padleDown = true;
  }

  paddleStop(client: Socket, Game: GameDto) {
	if (client.id === Game.p1.socket.id) {
		 Game.p1.padleUp = false;
		 Game.p1.padleDown = false;
	}
	else {
		Game.p2.padleUp = false;
		Game.p2.padleDown = false;
	}
  }

  private paddleCalculate(Game: GameDto) {
    if (Game.p1.padleUp === true) {
      if (Game.p1.padleY > 0) {
        Game.p1.padleY -= Game.p1.speed;
      }
    }
    if (Game.p1.padleDown === true) {
      if (Game.p1.padleY < CanvasHeight - Game.p1.padleH) {
        Game.p1.padleY += Game.p1.speed;
      }
    }
    if (Game.p2.padleUp === true) {
      if (Game.p2.padleY > 0) {
        Game.p2.padleY -= Game.p2.speed;
      }
    }
    if (Game.p2.padleDown === true) {
      if (Game.p2.padleY < CanvasHeight - Game.p2.padleH) {
        Game.p2.padleY += Game.p2.speed;
      }
    }
  }

  gameLoop(Game: GameDto) {
    Game.interval = setInterval(() => {
      this.update(Game);
    }, 1000 / 45);
  }

  gameLoop_v2(Game: GameDto) {
    Game.interval = setInterval(() => {
      this.update_v2(Game);
    }, 1000 / 45);
  }

  finishGame(Game: GameDto, p1_win: boolean) {
	if (p1_win) {
		if (Game.nsp)
			Game.nsp.in(Game.roomName).emit('end-game', true);
		else
			Game.p1.socket.emit('end-game', true);
	}
	else {
		if (Game.nsp)
			Game.nsp.in(Game.roomName).emit('end-game', false);
		else
			Game.p1.socket.emit('end-game', false);
	}
	clearInterval(Game.interval);
  }
}

