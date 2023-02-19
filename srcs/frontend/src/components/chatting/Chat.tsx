import { Card, Row, Image } from "react-bootstrap";
import { Button } from "react-bootstrap";
import MySocket from "./MySocket";
import { SocketOutputDto } from "./types";

export function Chat({msg} :{ msg :SocketOutputDto }) {
    if (msg.author === MySocket.instance.name) {
        return (
            <Row className="m-0 p-0 pb-1 h-auto justify-content-end">
                <Card className="d-flex h-auto w-75 p-0">
                    <Card.Header>{msg.author}</Card.Header>
                    <Card.Text className="px-2">{msg.message}</Card.Text>
                </Card>
            </Row>
        )
    }
    else if (msg.author === "server"){
        return (
            <Row className="m-0 p-0 pb-1 h-auto text-left justify-content-center">
                <pre style={{ color:"red", whiteSpace:"pre-line" }}>{msg.message}</pre>
                <hr style={{ color:"red" }}/>
            </Row>
        )
    }
    else {
        const joinGame = () => {
            console.log("초대한 게임에 참여함");
        }
        const showProfile = () => {
            console.log("누른 상대 프로필 보기");
        }
        return (
            <Row className="m-0 p-0 pb-1 h-auto">
                <Image roundedCircle src="/img/Anonymous.jpeg" style={{width: "50px", height: "50px"}} className="p-0 me-2" onClick={showProfile}/>
                <Card className="d-flex h-auto w-75 p-0">
                    <Card.Header>{msg.author}</Card.Header>
                    <Card.Text className="px-2"> {msg.message}</Card.Text>
                    {/* {
                        msg.target && <Button variant="outline-dark" onClick={joinGame}>참여하기</Button>
                    } */}
                </Card>
            </Row>
        );
    }
}