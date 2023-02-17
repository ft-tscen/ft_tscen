import { useRef } from "react";
import { Button, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Message, SOCKET_EVENT } from "./types";
import MySocket from "./MySocket";

export function InputMsg({setReceivedMsg} :{setReceivedMsg:React.Dispatch<React.SetStateAction<Message|undefined>>}) {
  const chatInputRef = useRef<HTMLInputElement>(null);

  const submitHandler = (event :React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    const enteredText : Message = { name: MySocket.instance.name, text :chatInputRef.current!.value, time :new Date().toLocaleTimeString('en-US')};
    if (chatInputRef.current!.value !== "") {
      MySocket.instance.emit(SOCKET_EVENT.SEND, enteredText);
      setReceivedMsg({ name: "me", text :chatInputRef.current!.value, time :new Date().toLocaleTimeString('en-US')});
      chatInputRef.current!.value = "";
    }
  };

	return (
		<>
      <Row className="w-100 m-0 pt-3">
        <hr style={{ color: "white" }}/>
      </Row>
      <Row className="w-100 m-0 pb-3">
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
    </>
	);
}