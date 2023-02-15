import { Injectable } from '@nestjs/common';
import { GameDto } from './dtos/game.dto';
//	Dto에 필요한 변수 : score, ball_x, ball_velocityX, ball_y, ball_velocityY, left_padle_y, right_padle_y, roomName

@Injectable()
export class GameService {

	caculatePadle(gameDto: GameDto) {
	//	if (left_padle_up == true)
	//		left_padle_y += 2
	//		if (최대 높이를 초과했으면) 최대 높이로 초기화
	//	if (right_padle_up == true)
	//		right_padle_y += 2
	//		if (최대 높이를 초과했으면) 최대 높이로 초기화

	//	if (left_padle_down == true)
	//		left_padle_y += 2
	//		if (최소 높이 미만이면) 최소 높이로 초기화
	//	if (right_padle_down == true)
	//		right_padle_y += 2
	//		if (최소 높이 미만이면) 최소 높이로 초기화
	}



	gameLoop(gameDto: GameDto) {

	//	if (공이 왼쪽 끝에 도달하였는지)
	//		left player 점수 추가
	//		if 최대 점수면 게임 끝
	// else if (공이 오른쪽 끝에 도달하였는지)
	//		right player 점수 추가
	//		if 최대 점수면 게임 끝

	//	calculate padle()

	//	ball_x += ball_velocityX;
	//	ball_y += ball_velocityY;

	//	if (공이 천장에 닿으면)

	//	else if (공이 바닥에 닿으면)

	//	if (공이 패들과 충돌 감지됨)
	//		충돌 알고리즘

	//	socket.broadcast.to(roomName).emit('update', GameDto);

	}
}
