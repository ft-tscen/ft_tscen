function EndPage (ctx: CanvasRenderingContext2D, CanvasWidth: number, CanvasHeight: number, res: boolean) {
	ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);
	ctx.fillStyle = "BLACK";
	ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
	ctx.fillStyle = "WHITE";
	const fontSize = (CanvasWidth/15).toString();
	ctx.font = fontSize + "px serif";
	ctx.textAlign = "center";
	if (res)
		ctx.fillText("p1 win", CanvasWidth/2, CanvasHeight/2);
	else
		ctx.fillText("p2 win", CanvasWidth/2, CanvasHeight/2);
}

export default EndPage;