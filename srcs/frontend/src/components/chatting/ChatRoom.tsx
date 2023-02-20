import { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { SocketOutputDto, SOCKET_EVENT } from "./types";
import { Chat } from "./Chat";
import "./Effect.css";
import MySocket from "./MySocket";

type ArgsType = {
    msgList :SocketOutputDto[],
    setReceivedMsg:React.Dispatch<React.SetStateAction<SocketOutputDto|undefined>>
    enterGame : (dto: SocketOutputDto) => void
}

export function ChatRoom({msgList, setReceivedMsg, enterGame} :ArgsType) {
    const chatWindow = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatWindow.current) {
            chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
        }
    }, [msgList]);

    useEffect(() => { // channel-msg
        const setDMMsg = (dto :SocketOutputDto) => {
            dto.type = SOCKET_EVENT.DM;
            setReceivedMsg(dto)};
        const setInviteMsg = (dto :SocketOutputDto) => {
            dto.type = SOCKET_EVENT.INVITE;
            setReceivedMsg(dto)};

        MySocket.instance.on(SOCKET_EVENT.MSG, setReceivedMsg);
        MySocket.instance.on(SOCKET_EVENT.DM, setDMMsg);
        MySocket.instance.on(SOCKET_EVENT.INVITE, setInviteMsg);
        MySocket.instance.on(SOCKET_EVENT.NOTICE, setReceivedMsg);
        return ()=>{
            MySocket.instance.off(SOCKET_EVENT.MSG, setReceivedMsg);
            MySocket.instance.off(SOCKET_EVENT.DM, setDMMsg);
            MySocket.instance.off(SOCKET_EVENT.INVITE, setInviteMsg);
            MySocket.instance.off(SOCKET_EVENT.NOTICE, setReceivedMsg);
        };
    }, []);
    return (
        <Container
            className="m-0 mt-auto p-0 Scrollable"
            style={{ height:"75vmin" }}
            ref={chatWindow}>
            {
                msgList.map((msg :SocketOutputDto, idx :number) => {
                    return (
                        <Chat key={idx} msg={msg} enterGame={enterGame}/>
                    );
                })
            }
        </Container>
    );
}