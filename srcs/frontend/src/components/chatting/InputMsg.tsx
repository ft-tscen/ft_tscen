import { useRef } from "react";
import { Button, Container, Form, InputGroup, Row } from "react-bootstrap";
import { HELP, WRONGINPUT, Message, SOCKET_EVENT } from "./types";
import MySocket from "./MySocket";

export function InputMsg({setReceivedMsg} :{setReceivedMsg:React.Dispatch<React.SetStateAction<Message|undefined>>}) {
    const chatInputRef = useRef<HTMLInputElement>(null);

    const submitHandler = (event :React.FormEvent<HTMLElement>) => {
        event.preventDefault();
        if (chatInputRef.current!.value !== "") {
            let text :string;
            let target:string;
            let words :string[] = chatInputRef.current!.value.split(" ");
            switch (words.at(0)) {
                case "/HELP":
                    text = HELP;
                    words.length !== 1
                    ? setReceivedMsg({ name: "server", text :WRONGINPUT })
                    : setReceivedMsg({ name: "server", text :text });
                    // MySocket.instance.emit(SOCKET_EVENT.HELP, enteredMSG);
                    break;
                case "/CHANNEL":
                    if (words.length === 3) {
                        let type :string = words[1];
                        if (type !== "public") {
                            setReceivedMsg({ name: "server", text :WRONGINPUT })
                        }
                        else {
                            target = words[2];
                        }
                    }
                    else if (words.length === 4) {
                        let type :string = words[1];
                        if (type === "public") {
                            setReceivedMsg({ name: "server", text :WRONGINPUT })
                        }
                        else {
                            // 비밀번호 = words[2];
                            target = words[3];
                        }
                    }
                    else {
                        setReceivedMsg({ name: "server", text :WRONGINPUT });
                        break;
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.CHANNEL, enteredMSG);
                    break;
                case "/DM":
                    if (words.length < 3) {
                        target = words[1];
                        text = chatInputRef.current!.value.slice(words[0].length + words[1].length + 2);
                    }
                    else {
                        setReceivedMsg({ name: "server", text :WRONGINPUT });
                        break;
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.DM, enteredMSG);
                    break;
                case "/INVITE":
                    if (words.length !== 2) {
                        setReceivedMsg({ name: "server", text :WRONGINPUT });
                        break;
                    }
                    else {
                        target = words[1];
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.INVITE, enteredMSG);
                    break;
                case "/PROFILE":
                    if (words.length !== 2) {
                        setReceivedMsg({ name: "server", text :WRONGINPUT });
                        break;
                    }
                    else {
                        target = words[1];
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.PROFILE, enteredMSG);
                    break;
                case "/ROOMSTATE":
                    if (words.length === 2 || words[1] === "public") {
                        // 비밀번호 = undefined;
                    }
                    else if (words.length === 3 || words[1] !== "public") {
                        // 비밀번호 = words[2];
                    }
                    else {
                        setReceivedMsg({ name: "server", text :WRONGINPUT });
                        break;
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.ROOMSTATE, enteredMSG);
                    break;
                case "/PASSWORD":
                    if (words.length === 2) {
                        // 비밀번호 = words[1];
                    }
                    else {
                        setReceivedMsg({ name: "server", text :WRONGINPUT });
                        break;
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.PASSWORD, enteredMSG);
                    break;
                case "/HANDOVER":
                    if (words.length === 2) {
                        target = words[1];
                    }
                    else {
                        setReceivedMsg({ name: "server", text :WRONGINPUT });
                        break;
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.HANDOVER, enteredMSG);
                    break;
                case "/BAN":
                    if (words.length === 3 && !isNaN(Number(words[2]))) {
                        target = words[1];
                        // sec = Number(words[2]);
                    }
                    else {
                        setReceivedMsg({ name: "server", text :WRONGINPUT });
                        break;
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.BAN, enteredMSG);
                    break;
                case "/MUTE":
                    if (words.length === 3 && !isNaN(Number(words[2]))) {
                        target = words[1];
                        // sec = Number(words[2]);
                    }
                    else {
                        setReceivedMsg({ name: "server", text :WRONGINPUT });
                        break;
                    }
                    // MySocket.instance.emit(SOCKET_EVENT.MUTE, enteredMSG);
                    break;
                default:
                    text = chatInputRef.current!.value;
                    const enteredMSG : Message = { name: MySocket.instance.name, text :text, time :new Date().toLocaleTimeString('en-US')};
                    MySocket.instance.emit(SOCKET_EVENT.SEND, enteredMSG);
                    setReceivedMsg({ name: "me", text :chatInputRef.current!.value, time :new Date().toLocaleTimeString('en-US')});
                    // setReceivedMsg({ name: "haha", text :chatInputRef.current!.value, time :new Date().toLocaleTimeString('en-US'), type :"invite"});
                    break;
            }
            chatInputRef.current!.value = "";
        }
    };

    return (
        <Container className="p-0 m-0 pt-3" style={{ height:"7vmin" }}>
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