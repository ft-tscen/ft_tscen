import { useRef, useState } from "react";
import { Button, Card, Form, InputGroup, Row } from "react-bootstrap";
import { BoolType, GameRoomType, SocketOutputDto, SOCKET_GAME_EVENT } from "../../common/types";
import { myGameSocket, mySocket } from "../../common/MySocket";
import "./Effect.css"

type ArgsType = {
    obj :GameRoomType,
    setReceivedMsg: React.Dispatch<
        React.SetStateAction<SocketOutputDto | undefined>
    >;
}

export function GameRoom({obj, setReceivedMsg} :ArgsType) {
    let [visible, setVisible] :BoolType = useState<boolean>(false);

    let name :string = (obj.password ? `🔒 ${obj.roomName} 🔒` : obj.roomName);
    const pwInputRef = useRef<HTMLInputElement>(null);

    const toWatchTheGame = () => {
        let pw :string|undefined = pwInputRef.current!.value;
        myGameSocket.socket.emit(SOCKET_GAME_EVENT.WATCH, obj.roomName, pw,
            ({success, payload} :{success :boolean, payload :string}) => {
                setReceivedMsg({author:'server', message:payload})
            });
        offVisible();
        pwInputRef.current!.value = "";
    }

    const onVisible = () => setVisible(true);
    const offVisible = () => setVisible(false);

    return (
        <Row className="mb-2 align-items-center">
            <Card
                className="CursorPointer"
                bg="dark" text="light">
                <Card.Title
                    className="m-0 text-center Dragunable"
                    onClick={ visible === true ? offVisible : onVisible }
                    >{name}
                </Card.Title>
                {
                    visible && <Card.Body className="flex-column">
                                    {
                                        obj.password && <InputGroup>
                                                            <Form.Control
                                                                placeholder="비밀번호를 입력하세요."
                                                                aria-label="With textarea"
                                                                aria-describedby="basic-addon2"
                                                                ref={pwInputRef}
                                                            />
                                                        </InputGroup>
                                    }
                                    <Button
                                        className="w-100"
                                        variant="outline-light"
                                        size="lg"
                                        onClick={toWatchTheGame}
                                        >관전하기
                                    </Button>
                                </Card.Body>
                }
            </Card>
        </Row>
    );
}
