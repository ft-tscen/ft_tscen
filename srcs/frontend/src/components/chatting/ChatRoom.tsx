import { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { SocketOutputDto, SOCKET_EVENT } from "./types";
import { Chat } from "./Chat";
import "./Effect.css";
import MySocket from "./MySocket";

export function ChatRoom({msgList, setReceivedMsg} :{msgList :SocketOutputDto[], setReceivedMsg:React.Dispatch<React.SetStateAction<SocketOutputDto|undefined>>}) {
    const chatWindow = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatWindow.current) {
            chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
        }
    }, [msgList]);

    useEffect(() => {
        MySocket.instance.on(SOCKET_EVENT.MSG, setReceivedMsg);
        MySocket.instance.on(SOCKET_EVENT.JOIN, setReceivedMsg);
        
        return ()=>{
            MySocket.instance.off(SOCKET_EVENT.MSG, setReceivedMsg);
            MySocket.instance.off(SOCKET_EVENT.JOIN, setReceivedMsg);
        };
    }, [])
    
    return (
        <Container
            className="m-0 mt-auto p-0 Scrollable"
            style={{ height:"75vmin" }}
            ref={chatWindow}>
            {
                msgList.map((msg :SocketOutputDto, idx :number) => {
                    return (
                        <Chat msg={msg} key={idx}/>
                    );
                })
            }
        </Container>
    );
}