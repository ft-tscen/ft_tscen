import { useEffect, useState, useRef } from 'react';

import { userType, netType, ballType, dataType } from './GameType';

import { io } from "socket.io-client"
import EndPage from './PageEnd';
import ReadyPage from './PageReady';
import WaitPage from './PageWait';
import { gameMod } from './GameType';

type gameComponent = {
	mod: gameMod;
};

const socketa = io(`http://${process.env.REACT_APP_NESTJS_HOST}:3001/game`);

function Game({ mod }: gameComponent) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	let CanvasWidth = 600;
	let CanvasHeight = 400;

	// const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
	// const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [canvas, setCanvas] = useState<any>();
	const [ctx, setCtx] = useState<any>();

	const [startGame, setStartGame] = useState<boolean>(false);

	let [data, setData] = useState<dataType>();

	const [leftName, setLeftName] = useState<string>("user");
	const [rightName, setRightName] = useState<string>("com");

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

	useEffect(()=> {
		const canvas = canvasRef.current;
		if (canvas) {
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
	}, []);

///////////////////// socket 관련 이벤트 /////////////////////////////////

	useEffect(() => {
		if (canvas && ctx) {
			if (mod === gameMod.soloGame) {
				ReadyPage(ctx, CanvasWidth, CanvasHeight);
				document.addEventListener('keydown', (e) => {
				if (e.code === 'KeyR') {
					socketa.emit('ready-solo');
					setStartGame(true);
				}
				});
			}
			if (mod === gameMod.rankGame) {
				WaitPage(ctx, CanvasWidth, CanvasHeight);
				socketa.emit('matching');
				//socketa.on('matching', ()=> {})
				// 매칭 성공 이벤트 받으면 레디 입력 받고 ready-rank 이벤트 보내야함
			}

			socketa.on('update', (data: dataType) => {
				setData({
					leftPaddle : data.leftPaddle,
					rightPaddle : data.rightPaddle,
					ballX : data.ballX,
					ballY : data.ballY,
					leftScore : data.leftScore,
					rightScore : data.rightScore,
				})
			})

			socketa.on('end-game', (res: boolean) => {
				const ctx = canvas?.getContext("2d");
				if (ctx) {
					// ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);
					// drawRect(0, 0, CanvasWidth, CanvasHeight, "BALCK");
					// ctx.fillStyle = "WHITE";
					// ctx.font = "40px serif";
					// ctx.textAlign = "center";
					// if (res)
					// 	ctx.fillText("p1 win", CanvasWidth/2, CanvasHeight/2);
					// else
					// 	ctx.fillText("p2 win", CanvasWidth/2, CanvasHeight/2);
					EndPage(ctx, CanvasWidth, CanvasHeight, res);
					killSockets(socketa);
					socketa.emit('end-game');
				}
			})
		}
	}, [ctx])

	function killSockets(socket : any) {
		socket.off('end-game');
		socket.off('update');
		// socket.off('setData');
	}

//////////////////////////paddle 관련 이벤트////////////////////////////

	let [paddleUp, setPaddleUp] = useState<boolean>(false);
	let [paddleDown, setPaddleDown] = useState<boolean>(false);

	document.addEventListener('keydown', (e) => {
		if (startGame) {
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
		if (startGame) {
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
		// game시작 했을 때만 적용되게
		if (startGame) {
			if (paddleUp === true) {
				socketa.emit('PaddleUp');
			}
			if (paddleDown === true) {
				socketa.emit('PaddleDown');
			}
			if (paddleDown === false && paddleUp === false) {
				socketa.emit('PaddleStop');
			}
		}
	}, [paddleDown, paddleUp]);

//////////////////////////canvas draw Function//////////////////////////////////

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
			const fontSize = (CanvasWidth/8).toString();
			ctx.font = fontSize + "px serif";
			ctx.fillText(text, x, y);
		}
	}


///////////////////////////////render Event/////////////////////////////////////

	useEffect(() => {
		if (canvas && ctx)
			if (data) {
				render(data);
			}
	}, [data])

	function render(data: dataType) {
		if (ctx) {
			ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);
			drawRect(0, 0, CanvasWidth, CanvasHeight, "BLACK");
			drawText(data.leftScore.toString(),CanvasWidth/4,CanvasHeight/5,"WHITE");
			drawText(data.rightScore.toString(),3*CanvasWidth/4,CanvasHeight/5,"WHITE");
			drawNet();
			drawRect(leftUser.x,data.leftPaddle,leftUser.width, leftUser.height, leftUser.color);
			drawRect(RightUser.x,data.rightPaddle,RightUser.width,RightUser.height,RightUser.color);
			drawCircle(data.ballX,data.ballY,ball.radius,ball.color);
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
