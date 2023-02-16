import { Container, Button, OverlayTrigger, Popover } from "react-bootstrap";

export function Channels() {
	let b : { name:string, num:number }[] = [];
	for (let i :number = 1; i <= 25; ++i) {
	  b.push({name :`${i}번 채널`, num :i});
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
		<Container className="d-flex flex-column mb-auto p-0" style={{ overflowY:"scroll" }}>
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