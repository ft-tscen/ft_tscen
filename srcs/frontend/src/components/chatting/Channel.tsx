import { useRef, useState } from "react";
import { Button, Card, Form, InputGroup, Row } from "react-bootstrap";
import { ChannelType, SocketInputDto, SocketOutputDto, SOCKET_EVENT } from "./types";
import MySocket from "./MySocket";
import "./Effect.css"

type ArgsType = {
    obj: ChannelType,
    enterChannel : (dto: SocketOutputDto) => void
};
type Visible = [
    visible :boolean,
    setVisible:React.Dispatch<React.SetStateAction<boolean>>
];

export function Channel({obj, enterChannel} :ArgsType) {
    let [visible, setVisible] :Visible = useState<boolean>(false);
    let name :string = (obj.password ? `🔒 ${obj.name} 🔒` : obj.name);
    const pwInputRef = useRef<HTMLInputElement>(null);

    const toJoinTheGame = () => {
        let pw :string|undefined = pwInputRef.current?.value;
        const dto :SocketInputDto = {
            author: MySocket.instance.name,
            target: obj.name,
            password: pw
        };

        MySocket.instance.emit(SOCKET_EVENT.JOIN, dto, enterChannel);
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
                                        onClick={toJoinTheGame}
                                        >들어가기
                                    </Button>
                                </Card.Body>
                }
            </Card>
        </Row>
    );
}
