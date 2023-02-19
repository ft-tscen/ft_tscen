import { ChatMenuBar } from "./ChatMenuBar";
import { GameRooms } from "./GameRooms";
import { LEAVE_CHANNEL, ENTER_CHANNEL, SocketOutputDto, SHOW_OTHER, SHOW_CHATROOM, STARTMSG, SOCKET_EVENT } from "./types"
import { useEffect, useState } from "react";
import { ChatRoom } from "./ChatRoom";
import MySocket from "./MySocket";
import { InputMsg } from "./InputMsg";
import { Channels } from "./Channels";

export default function ChatPart() {
    let [msgList, setMsgList] :[msgList :SocketOutputDto[], setMsgList:React.Dispatch<React.SetStateAction<SocketOutputDto[]>>] = useState<SocketOutputDto[]>([STARTMSG]);
    let [receivedMsg, setReceivedMsg] :[receivedMsg :SocketOutputDto|undefined, setReceivedMsg:React.Dispatch<React.SetStateAction<SocketOutputDto|undefined>>] = useState<SocketOutputDto>();
    let [flag, setFlag] : [flag :boolean, setFlage :React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(SHOW_CHATROOM);
    let [enterChannelFlag, setEnterChannelFlag] : [enterChannelFlag :boolean, setEnterChannelFlag :React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(LEAVE_CHANNEL);

    // MySocket.instance.name = "unknown";

    const enterChannel = (dto :SocketOutputDto) => {
        setEnterChannelFlag(ENTER_CHANNEL);
        MySocket.instance.enteredChannelName = dto.target;
        setReceivedMsg(dto);
    }

    useEffect(() => {
        MySocket.instance.enteredChannelName === undefined ? setEnterChannelFlag(LEAVE_CHANNEL) : setEnterChannelFlag(ENTER_CHANNEL);
    }, [MySocket.instance.enteredChannelName]);

    useEffect(() => {
        if (receivedMsg) {
            setMsgList([...msgList, receivedMsg]);
        }
    }, [receivedMsg]);

	return (
        <>
            <ChatMenuBar flag={flag} setFlag={setFlag} enterChannelFlag={enterChannelFlag} setEnterChannelFlag={setEnterChannelFlag} setReceivedMsg={setReceivedMsg}/>
            {
                flag === SHOW_OTHER
                ? (enterChannelFlag === ENTER_CHANNEL ? <GameRooms/> : <Channels enterChannel={enterChannel}/>)
                : <ChatRoom msgList={msgList} setReceivedMsg={setReceivedMsg}/>
            }
            {
                flag === SHOW_CHATROOM ? <InputMsg setReceivedMsg={setReceivedMsg}/> : null
            }
        </>
	);
}