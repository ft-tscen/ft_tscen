import { ChatMenuBar } from "./ChatMenuBar";
import { GameRooms } from "./GameRooms";
import { LEAVE_CHANNEL, ENTER_CHANNEL, SocketInputDto, SocketOutputDto, SHOW_OTHER, SHOW_CHATROOM, SOCKET_EVENT, STARTMSG } from "./types"
import { useEffect, useState } from "react";
import { ChatRoom } from "./ChatRoom";
import MySocket from "./MySocket";
import { InputMsg } from "./InputMsg";
import { Channels } from "./Channels";

export default function ChatPart() {
    let [msgList, setMsgList] :[msgList :SocketOutputDto[], setMsgList:React.Dispatch<React.SetStateAction<SocketOutputDto[]>>] = useState<SocketOutputDto[]>([STARTMSG]);
    let [receivedMsg, setReceivedMsg] :[receivedMsg :SocketInputDto|undefined, setReceivedMsg:React.Dispatch<React.SetStateAction<SocketInputDto|undefined>>] = useState<SocketInputDto>();
    let [flag, setFlag] : [flag :boolean, setFlage :React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(SHOW_CHATROOM);
    let [enterChannelFlag, setEnterChannelFlag] : [enterChannelFlag :boolean, setEnterChannelFlag :React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(ENTER_CHANNEL);

    MySocket.instance.on(SOCKET_EVENT.RECEIVE, setReceivedMsg);

    useEffect(() => {
        if (receivedMsg) {
            setMsgList([...msgList, receivedMsg]);
        }
    }, [receivedMsg]);

	return (
        <>
            <ChatMenuBar flag={flag} setFlag={setFlag} enterChannelFlag={enterChannelFlag} setEnterChannelFlag={setEnterChannelFlag}/>
            {
                flag === SHOW_OTHER
                ? (enterChannelFlag === ENTER_CHANNEL ? <GameRooms/> : <Channels/>)
                : <ChatRoom msgList={msgList}/>
            }
            {
                flag === SHOW_CHATROOM ? <InputMsg setReceivedMsg={setReceivedMsg}/> : null
            }
        </>
	);
}