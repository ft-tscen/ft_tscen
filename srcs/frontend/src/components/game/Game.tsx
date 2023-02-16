import { useEffect, useState, useRef } from 'react';

import { userType, netType, ballType, dataType } from './GameType';

import { socket } from "../../index"

function Game() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	let CanvasWidth = 600;
	let CanvasHeight = 400;

	const [canvas, setCanvas] = useState<any>();
	const [ctx, setCtx] = useState<any>();
	const [rerender, setRerender] = useState(true);
	// const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
	// const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	// const [startGame, setStartGame] = useState<boolean>(false);
	const [ready, setReady] = useState<boolean>(false);
	const [init, setInit] = useState<boolean>(false);

	const [gameMod, setGameMod] = useState(0);
	const [socket, setSocket] = useState<any>([]);
	// const [leftScore, setLeftScore] = useState(0);
	// const [rightScore, setRightScore] = useState(0);

	const [leftName, setLeftName] = useState<string>("user");
	const [rightName, setRightName] = useState<string>("com");

	let lName:string;
	let rName:string;

	let lScore = 0;
	let rScore = 0;

	const [leftUser, setLeftUser] = useState<userType>({
		x: 5,
		y: (CanvasWidth - 100)/2,
		width: 10,
		height: 100,
		speed: 5,
		color: "WHITE",
	})

	const [RightUser, setRightUser] = useState<userType>({
		x: CanvasHeight - 15,
		y: (CanvasWidth - 100)/2,
		width: 10,
		height: 100,
		speed: 5,
		color: "WHITE",
	})

	const [net, setNet] = useState<netType>({
		x : CanvasWidth/2 - 2/2,
		y :	0,
		width : 2,
		height : 10,
		color : "WHITE",
	})

	const [ball, setBall] = useState<ballType>({
		x : 400/2,
		y : 600/2,
		radius : 10,
		velocityX : 5,
		velocityY : 5,
		speed : 7,
		color : "WHITE"
	})

	const [data, setData] = useState<dataType>();

	useEffect(()=> {
		// setSocket(socket);
		const canvas = canvasRef.current;
		if (canvas) {
			// console.log(ball.velocityX);
			canvas.height = CanvasHeight;
			canvas.width = CanvasWidth;
			setCanvas(canvas);
			setCtx(canvas.getContext("2d"));
			setBall({
				x : canvas.width/2,
				y : canvas.height/2,
				radius : 10,
				velocityX : 5,
				velocityY : 5,
				speed : 5,
				color : "WHITE"
			});
			setNet({
				x : CanvasWidth/2 - 2/2,
				y :	0,
				width : 2,
				height : 10,
				color : "WHITE",
			})
			setLeftUser({
				x: 5,
				y: (canvas.height - 100)/2,
				width: 10,
				height: 100,
				speed: 5,
				color: "WHITE",
			});
			setRightUser({
				x: canvas.width - 15,
				y: (canvas.height - 100)/2,
				width: 10,
				height: 100,
				speed: 5,
				color: "WHITE",
			})
		}

		// socket.on('scoreUpdate', (res: boolean) => {
		// 	if (res == true) {
		// 		lScore++;
		// 		// setLeftScore(lScore);
		// 	} 
		// 	else {
		// 		rScore++;
		// 		// setRightScore(rScore);
		// 	}
		// })
		setRerender(!rerender);
		// socket.on('endGame', () => {
		// 	killSockets(socket);
		// })
	}, [rerender]);

	// function killSockets(socketi : any) {
	// 	socket.off('endGame');
	// 	socket.off('scoreUpdate');
	// 	// socket.off('setData');
	// }

	useEffect(() => {
		if (canvas && ctx) {
			ctx.fillStyle = "BLACK";
			ctx.font = "40px serif";
			ctx.textAlign = "center";
			ctx.fillText("Please Press 'R'", CanvasWidth/2, CanvasHeight/2);
			document.addEventListener('keydown', (e) => {
				if (e.code === 'KeyR') {
					console.log("press R");
					setReady(true);
					socket.emit('ready', (res: boolean) => {});
				}
			});
			// setReady(true);
		}
	}, [ctx])

	const [paddleUp, setPaddleUp] = useState<boolean>(false);
	const [paddleDown, setPaddleDown] = useState<boolean>(false);

	document.addEventListener('keydown', (e) => {
		if (ready) {
			var code = e.code;
		
			if (code === 'KeyS' && paddleDown === false) {
				setPaddleDown(true);
			}
			else if (code === 'KeyW' && paddleUp === false) {
				setPaddleUp(true);
			}
		}
	}, {once:true});
	
	document.addEventListener('keyup', (e) => {
		if (ready) {
			var code = e.code;
		
			if (code === 'KeyS' && paddleDown === true) {
				setPaddleDown(false);
			}
			else if (code === 'KeyW' && paddleUp === true) {
				setPaddleUp(false);
			}
		}
	}, {once:true});

	useEffect(() => {
		if (ready) {
			if (paddleUp === true) {
				////test/////
				// if (leftUser.y > 0) {
				// 	leftUser.y -= leftUser.speed;
				// }
				/////socket////
				socket.emit('PaddleUp');
			}
			if (paddleDown === true) {
				////test/////
				// if (leftUser.y < CanvasHeight - RightUser.height) {
				// 	leftUser.y += leftUser.speed;
				// }
				/////socket////
				socket.emit('PaddleDown');
			}
			// // socket //
			if (paddleDown === false && paddleUp === false) {
				socket.emit('PaddleStop');
			}
		}
	}, [paddleDown, paddleUp]);

	useEffect(() => {
		if (ready) {
			if (paddleUp === true) {
				////test/////
				// console.log("up");
				// console.log(ball.velocityX);
				// if (leftUser.y > 0) {
				// 	leftUser.y -= leftUser.speed;
				// }
				/////socket////
				socket.emit('PaddleUp');
			}
			if (paddleDown === true) {
				////test/////
				// console.log("down");
				// if (leftUser.y < CanvasHeight - RightUser.height) {
				// 	leftUser.y += leftUser.speed;
				// }
				/////socket////
				socket.emit('PaddleDown');
			}
			// // socket //
			if (paddleDown === false && paddleUp === false) {
				socket.emit('PaddleStop');
			}
		}
	}, [paddleDown, paddleUp]);

	useEffect(() => {
		if (canvas && ctx)
			if (data)
				render(data);
	}, [data])

	function drawRect(x: number, y:number, w:number, h:number, color:string) {
		if (ctx) {
			ctx.fillStyle = color;
			ctx.fillRect(x, y, w, h);
		}
	}

	function drawCircle(x:number, y:number, r:number, color:string) {
		if (ctx) {
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.arc(x, y, r, 0, Math.PI*2, false);
			ctx.fill();
			ctx.closePath();
		}
	}

	function drawNet() {
		for (let i = 0; i <= canvas.height; i += 15) {
			drawRect(net.x, net.y + i, net.width, net.height, net.color);
		}
	}

	function drawText(text:string, x:number, y:number, color:string) {
		if (ctx) {
			ctx.fillStyle = color;
			ctx.font = "75px serif";
			ctx.fillText(text, x, y);
		}
	}

	function render(data: dataType){
		if (ctx) {
			ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);
			drawRect(0, 0, CanvasWidth, CanvasHeight, "BLACK");
			drawText(lScore.toString(),CanvasWidth/4,CanvasHeight/5,"WHITE");
			drawText(rScore.toString(),3*CanvasWidth/4,CanvasHeight/5,"WHITE");
			drawNet();
			drawRect(leftUser.x,leftUser.y,leftUser.width, leftUser.height, leftUser.color);
			drawRect(RightUser.x,RightUser.y,RightUser.width,RightUser.height,RightUser.color);
			drawCircle(data.ball_x,data.ball_y,ball.radius,ball.color);
		}
	}

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={CanvasWidth}
				height={CanvasHeight}/>
		</div>
	);
}

export default Game;