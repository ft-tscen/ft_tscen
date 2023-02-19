import { useRef } from "react";
import { Button, Container, Form, InputGroup, Row } from "react-bootstrap";
import { HELP, WRONGINPUT, SocketInputDto, SocketOutputDto, SOCKET_EVENT } from "./types";
import MySocket from "./MySocket";

export function InputMsg({setReceivedMsg} :{setReceivedMsg:React.Dispatch<React.SetStateAction<SocketOutputDto|undefined>>}) {
    const chatInputRef = useRef<HTMLInputElement>(null);

    // parseInt((Math.random() * 100).toString())

    const submitHandler = (event :React.FormEvent<HTMLElement>) => {
        event.preventDefault();
        if (chatInputRef.current!.value !== "") {
            let text :string|undefined = chatInputRef.current!.value;
            let words :string[] = chatInputRef.current!.value.split(" ");
            const enteredMSG : SocketInputDto = { author: MySocket.instance.name, target: MySocket.instance.enteredChannelName, message :text};
            switch (words.at(0)) {
                case "/HELP":
                    text = HELP;
                    words.length !== 1
                    ? setReceivedMsg({ author: "server", message :WRONGINPUT })
                    : setReceivedMsg({ author: "server", message :text });
                    break;
                case "/CHANNEL":
                    if (words.length !== 2) {
                        setReceivedMsg({ author: "server", message :WRONGINPUT });
                        break;
                    }
                    enteredMSG.target = words[1];
                    MySocket.instance.emit(SOCKET_EVENT.JOIN, enteredMSG, (dto :SocketOutputDto) => {
                        MySocket.instance.enteredChannelName = dto.target;
                        setReceivedMsg(dto);
                    });
                    break;
                case "/DM":
                    if (words.length >= 3) {
                        enteredMSG.target = words[1];
                        text = chatInputRef.current!.value.slice(words[0].length + words[1].length + 2);
                    }
                    else {
                        setReceivedMsg({ author: "server", message :WRONGINPUT });
                        break;
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.DM, enteredMSG);
                    break;
                case "/INVITE":
                    if (words.length !== 2) {
                        setReceivedMsg({ author: "server", message :WRONGINPUT });
                        break;
                    }
                    else {
                        enteredMSG.target = words[1];
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.INVITE, enteredMSG);
                    break;
                case "/PROFILE":
                    if (words.length !== 2) {
                        setReceivedMsg({ author: "server", message :WRONGINPUT });
                        break;
                    }
                    else {
                        enteredMSG.target = words[1];
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.PROFILE, enteredMSG);
                    break;
                case "/BLOCK":
                    if (words.length === 2) {
                        enteredMSG.target = words[1];
                    }
                    else {
                        setReceivedMsg({ author: "server", message :WRONGINPUT });
                        break;
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.BLOCK, enteredMSG);
                    break;
                case "/ROOMSTATE":
                    let pw :number = words.indexOf("-p");
                    let hide :number = words.indexOf("-h");
                    if(pw !== -1) {
                        // words[pw + 1] && password = words[pw + 1];
                        // MySocket.instance.emit(SOCKET_EVENT.PASSWORD, enteredMSG);
                    }
                    if (hide !== -1) {
                        // MySocket.instance.emit(SOCKET_EVENT.HIDEROOM, enteredMSG);
                    }
                    if (pw === -1 && hide === -1) {
                        setReceivedMsg({ author: "server", message :WRONGINPUT });
                        break;
                    }
                    break;
                case "/EMPOWER":
                    if (words.length === 2) {
                        enteredMSG.target = words[1];
                    }
                    else {
                        setReceivedMsg({ author: "server", message :WRONGINPUT });
                        break;
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.HANDOVER, enteredMSG);
                    break;
                case "/BAN":
                    if (words.length === 2) {
                        enteredMSG.target = words[1];
                    }
                    else {
                        setReceivedMsg({ author: "server", message :WRONGINPUT });
                        break;
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.BAN, enteredMSG);
                    break;
                case "/MUTE":
                    if (words.length === 2) {
                        enteredMSG.target = words[1];
                    }
                    else {
                        setReceivedMsg({ author: "server", message :WRONGINPUT });
                        break;
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.MUTE, enteredMSG);
                    break;
                default:
                    console.log(enteredMSG);
                    MySocket.instance.emit(SOCKET_EVENT.MSG, enteredMSG, setReceivedMsg);
                    // setReceivedMsg({ author: MySocket.instance.name, target: MySocket.instance.name , message :chatInputRef.current!.value});
                    // setReceivedMsg({ author: "haha", message :chatInputRef.current!.value});
                    break;
            }
            chatInputRef.current!.value = "";
        }
    };

    return (
        <Container className="p-0 m-0 pt-3" style={{ height:"6vmin" }}>
            <Row>
                <hr style={{ color: "white" }}/>
            </Row>
            <Row>
                <form onSubmit={submitHandler}>
                    <InputGroup>
                        <Form.Control
                            placeholder="메세지 보내기"
                            aria-label="With textarea"
                            aria-describedby="basic-addon2"
                            ref={chatInputRef}
                        />
                        <Button variant="outline-light" id="button-addon2" type="submit">
                            보내기
                        </Button>
                    </InputGroup>
                </form>
            </Row>
        </Container>
    );
}