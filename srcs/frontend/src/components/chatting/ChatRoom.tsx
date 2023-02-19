import { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { SocketOutputDto } from "./types";
import { Chat } from "./Chat";
import "./Effect.css";

export function ChatRoom({msgList} :{msgList :SocketOutputDto[]}) {
    const chatWindow = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatWindow.current) {
            chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
        }
    }, [msgList]);

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