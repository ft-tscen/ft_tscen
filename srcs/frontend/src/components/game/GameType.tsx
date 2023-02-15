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
	left_pladdle_y: number,
	right_pladdle_y:number,
	ball_x: number,
	ball_y: number,
}

export type { userType, netType, ballType, dataType }
