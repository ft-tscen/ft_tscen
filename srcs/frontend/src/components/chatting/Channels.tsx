import { Container, Button, OverlayTrigger, Popover } from "react-bootstrap";
import "./Scroll.css";

export function Channels() {
	let b : { name:string, num:number }[] = [];
	for (let i :number = 1; i <= 5; ++i) {
	    b.push({name :`${i}번 방`, num :i});
	}
  
    const toWatchTheGame = () => {
        console.log("To Watch the Game")
    }
    const toJoinTheGame = () => {
        console.log("To Join the Game")
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Body>
                <Button
                    className="w-50"
                    variant="outline-dark"
                    size="lg"
                    onClick={toWatchTheGame}
                    >관전하기
                </Button>
                <Button
                    className="w-50"
                    variant="outline-dark"
                    size="lg"
                    onClick={toJoinTheGame}
                    >참여하기
                </Button>
            </Popover.Body>
        </Popover>
    );

	return (
		<Container className="mb-auto m-0 p-0 Scrollable" style={{ height:"82vmin" }}>
        {
            b.map((obj :{ name:string, num:number }, idx :number) => {
                return (
                    <OverlayTrigger trigger={["focus"]} placement="left" overlay={popover} key={idx}>
                        <Button
                            className="w-100"
                            variant="outline-light"
                            size="lg">{obj.name}
                        </Button>
                    </OverlayTrigger>
                );
            })
        }
        </Container>
	);
}