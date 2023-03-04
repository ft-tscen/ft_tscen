import { ChatMenuBar } from "./ChatMenuBar";
import { GameRooms } from "./GameRooms";
import { LEAVE_CHANNEL, ENTER_CHANNEL, SocketOutputDto, SHOW_OTHER, SHOW_CHATROOM, STARTMSG, SOCKET_EVENT } from "../../common/types"
import { useEffect, useState } from "react";
import { ChatRoom } from "./ChatRoom";
import MySocket from "../../common/MySocket";
import { InputMsg } from "./InputMsg";
import { Channels } from "./Channels";

type MstList = [
    msgList :SocketOutputDto[],
    setMsgList:React.Dispatch<React.SetStateAction<SocketOutputDto[]>> 
];
type ReceivedMsg = [
    receivedMsg :SocketOutputDto|undefined,
    setReceivedMsg:React.Dispatch<React.SetStateAction<SocketOutputDto|undefined>>
];
type Flag = [
    flag :boolean,
    setFlage :React.Dispatch<React.SetStateAction<boolean>>
];
type EnterChannelFlag = [
    enterChannelFlag :boolean,
    setEnterChannelFlag :React.Dispatch<React.SetStateAction<boolean>>
]

export default function ChatPart() {
    let [msgList, setMsgList] :MstList = useState<SocketOutputDto[]>([STARTMSG]);
    let [receivedMsg, setReceivedMsg] :ReceivedMsg = useState<SocketOutputDto>();
    let [flag, setFlag] : Flag = useState<boolean>(SHOW_CHATROOM);
    let [enterChannelFlag, setEnterChannelFlag] :EnterChannelFlag = useState<boolean>(LEAVE_CHANNEL);

    const enterChannel = (dto :SocketOutputDto) => {
        MySocket.instance.enteredChannelName = dto.target;
        setReceivedMsg(dto);
    }
    const enterGame = (dto :SocketOutputDto) => {
        MySocket.instance.enteredGameName = dto.target;
        setReceivedMsg(dto);
    }
    const exitChannel = () => {
        MySocket.instance.emit(SOCKET_EVENT.LEAVE, {author: MySocket.instance.name, target: MySocket.instance.enteredChannelName}, setReceivedMsg);
        MySocket.instance.enteredChannelName = undefined;
        setEnterChannelFlag(LEAVE_CHANNEL);
    }
    const setDMMsg = (dto :SocketOutputDto) => {
        dto.type = SOCKET_EVENT.DM;
        setReceivedMsg(dto)};
    const setInviteMsg = (dto :SocketOutputDto) => {
        dto.type = SOCKET_EVENT.INVITE;
        setReceivedMsg(dto)};

    useEffect(() => {
        MySocket.instance.enteredChannelName === undefined ? setEnterChannelFlag(LEAVE_CHANNEL) : setEnterChannelFlag(ENTER_CHANNEL);
    }, [MySocket.instance.enteredChannelName]);

    useEffect(() => {
        if (receivedMsg) {
            setMsgList([...msgList, receivedMsg]);
        }
    }, [receivedMsg]);
    
    useEffect(() => {

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
        <>
            <ChatMenuBar
                flag={flag} setFlag={setFlag} 
                enterChannelFlag={enterChannelFlag}
                exitChannel={exitChannel}/>
            {
                flag === SHOW_OTHER
                ? (enterChannelFlag === ENTER_CHANNEL ? <GameRooms enterGame={enterGame}/> : <Channels enterChannel={enterChannel}/>)
                : <ChatRoom msgList={msgList} enterGame={enterGame}/>
            }
            {
                flag === SHOW_CHATROOM
                && <InputMsg setReceivedMsg={setReceivedMsg}
                            enterChannel={enterChannel}
                            setDMMsg={setDMMsg}
                            setInviteMsg={setInviteMsg}/>
            }
        </>
	);
}