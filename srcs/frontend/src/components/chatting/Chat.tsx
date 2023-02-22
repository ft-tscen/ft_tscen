import { Card, Row, Image } from "react-bootstrap";
import { Button } from "react-bootstrap";
import MySocket from "./MySocket";
import { SocketInputDto, SocketOutputDto, SOCKET_EVENT } from "./types";

type ArgsType = {
    msg :SocketOutputDto,
    enterGame : (dto: SocketOutputDto) => void
}

export function Chat({msg, enterGame} :ArgsType) {
    if (msg.author === "server"){
        return (
            <Row className="m-0 p-0 pb-1 h-auto text-left justify-content-center">
                <pre style={{ color:"red", whiteSpace:"pre-line" }}>{msg.message}</pre>
                <hr style={{ color:"red" }}/>
            </Row>
        )
    }
    else {
        const showProfile = () => {
            console.log("누른 상대 프로필 보기");
        }
        const joinGame = () => {
            console.log("초대한 게임에 참여함");
            let dto :SocketInputDto = {
                author :MySocket.instance.name,
                target :msg.target
            }
            MySocket.instance.emit(SOCKET_EVENT.ENTER_GAME, dto, enterGame);
        }
        return (
            <Row className={
                    msg.author === MySocket.instance.name
                    ? "m-0 p-0 pb-1 h-auto justify-content-end"
                    : "m-0 p-0 pb-1 h-auto"
                }>
                {
                    msg.author !== MySocket.instance.name
                    && <Image roundedCircle 
                            src="/img/Anonymous.jpeg" 
                            style={{width: "50px", height: "50px"}} 
                            className="p-0 me-2" 
                            onClick={showProfile}/>
                }
                <Card
                    className="d-flex h-auto w-75 p-0"
                    bg={msg.type === SOCKET_EVENT.DM ? "danger" : "secondary"}
                    text="white">
                    <Card.Header>
                        {
                            msg.type === SOCKET_EVENT.DM 
                            ? msg.author === MySocket.instance.name ? `me -> ${msg.target}` : `${msg.author} -> me`
                            : `${msg.author}`
                        }
                    </Card.Header>
                    <Card.Text className="px-2"> {msg.message}</Card.Text>
                    {
                        msg.type === SOCKET_EVENT.INVITE && msg.author !== MySocket.instance.name
                        && <Button variant="outline-dark" onClick={joinGame}>참여하기</Button>
                    }
                </Card>
            </Row>
        );
    }
}