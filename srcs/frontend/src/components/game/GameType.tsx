type userType = {
	x : number,
	y : number,
	width : number,
	height : number,
	speed: number,
	color : string,
}

type netType = {
	x : number,
	y :	number,
	width : number,
	height : number,
	color : string,
}

type ballType = {
	x : number,
	y : number,
	radius : number,
	velocityX : number,
	velocityY : number,
	speed : number,
	color : string,
}

type dataType = {
  leftPaddle : number,
  rightPaddle : number,
  ballX : number,
  ballY : number,
  leftScore: number,
  rightScore: number,
}

export type { userType, netType, ballType, dataType }
