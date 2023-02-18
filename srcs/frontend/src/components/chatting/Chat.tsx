import { Card, Row, Image } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Message } from "./types";

export function Chat({msg} :{ msg :Message }) {
    if (msg.name === "me") {
        return (
            <Row className="m-0 p-0 pb-1 h-auto justify-content-end">
                <Card className="d-flex h-auto w-75 p-0">
                    <Card.Header>{msg.name}({msg.time})</Card.Header>
                    <Card.Text className="px-2"> {msg.text}</Card.Text>
                </Card>
            </Row>
        )
    }
    else if (msg.name === "server"){
        return (
            <Row className="m-0 p-0 pb-1 h-auto text-left justify-content-center">
                <pre style={{ color:"red", whiteSpace:"pre-line" }}>{msg.text}</pre>
                <hr style={{ color:"red" }}/>
            </Row>
        )
    }
    else {
        const joinGame = () => {
            console.log("초대한 게임에 참여함");
        }
        return (
            <Row className="m-0 p-0 pb-1 h-auto">
                <Image roundedCircle src="/img/Anonymous.jpeg" style={{width: "50px", height: "50px"}} className="p-0 me-2"/>
                <Card className="d-flex h-auto w-75 p-0">
                    <Card.Header>{msg.name}({msg.time})</Card.Header>
                    <Card.Text className="px-2"> {msg.text}</Card.Text>
                    {
                        msg.type && msg.type === "invite" && <Button variant="outline-dark" onClick={joinGame}>참여하기</Button>
                    }
                </Card>
            </Row>
        );
    }
}