import { Container } from "react-bootstrap";
import { ChatMenuBar } from "./ChatMenuBar";
import { Channels } from "./Channels";
import { Message, SHOW_CHANNEL, SHOW_CHATROOM, SOCKET_EVENT } from "./types"
import { useEffect, useState } from "react";
import { ChatRoom } from "./ChatRoom";
import MySocket from "./MySocket";
import { InputMsg } from "./InputMsg";

export default function ChatPart() {
    let [msgList, setMsgList] :[msgList :Message[], setMsgList:React.Dispatch<React.SetStateAction<Message[]>>] = useState<Message[]>([]);
    let [flag, setFlag] : [flag :boolean, setFlage :React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(SHOW_CHATROOM);
    let [receivedMsg, setReceivedMsg] :[receivedMsg :Message|undefined, setReceivedMsg:React.Dispatch<React.SetStateAction<Message|undefined>>] = useState<Message>();
  
    MySocket.instance.on(SOCKET_EVENT.RECEIVE, setReceivedMsg);

    useEffect(() => {
        if (receivedMsg) {
            setMsgList([...msgList, receivedMsg]);
        }
    }, [receivedMsg]);

    return (
        <Container className="d-flex flex-column w-100 h-100 p-0 m-0">
            <ChatMenuBar flag={flag} setFlag={setFlag}/>
            {
                flag === SHOW_CHANNEL ? <Channels/> : <ChatRoom msgList={msgList}/>
            }
            <InputMsg setReceivedMsg={setReceivedMsg}/>
        </Container>
    );
}