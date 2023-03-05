import { useState } from "react";
import { Card, Row, Image, OverlayTrigger, Popover } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { api } from "../../axios/api";
import { mySocket } from "../../common/MySocket";
import {
    BoolType,
	SocketInputDto,
	SocketOutputDto,
	SOCKET_EVENT,
    UserData,
} from "../../common/types";

type ArgsType = {
    msg :SocketOutputDto,
    enterGame : (dto: SocketOutputDto) => void
    setReceivedMsg:React.Dispatch<React.SetStateAction<SocketOutputDto|undefined>>,
    setInform :React.Dispatch<React.SetStateAction<UserData>>,
}

export function Chat({msg, enterGame, setReceivedMsg, setInform} :ArgsType) {
    let [isFriend, setIsFriend] : BoolType = useState<boolean>(false);
    let [show, setShow] : BoolType = useState<boolean>(false);
    let [active, setActive] : BoolType = useState<boolean>(true);
    if (msg.author === "server"){
        return (
            <Row className="m-0 p-0 pb-1 h-auto text-left justify-content-center">
                <pre style={{ color:"red", whiteSpace:"pre-line" }}>{msg.message}</pre>
                <hr style={{ color:"red" }}/>
            </Row>
        )
    }
    else {
        const checkFriend = async () => {
	        const res = await api.get(`/user/friends`);
            if (res.data.friends.find((user :any) => user.nickname === msg.author))
                setIsFriend(true);
            else
                setIsFriend(false);
            show ? setShow(false) : setShow(true);
        }
        const beFriend = () => {
            let dto :SocketInputDto = {
                author :mySocket.name,
                target :msg.author,
            };
            mySocket.socket.emit(SOCKET_EVENT.BEFRIEND, dto, setReceivedMsg);
            setShow(false);
        }
        const delFriend = async () => {
	        await api.delete(`/user/friends?nickname=${msg.author}`);
            setShow(false);
        }
        const showProfile = () => {
            msg.user && setInform(msg.user);
            console.log("누른 상대 프로필 보기");
            setShow(false);
        }
        const joinGame = () => {
            console.log("초대한 게임에 참여함");
            let dto :SocketInputDto = {
                author :mySocket.name,
                target :msg.target
            }
            mySocket.socket.emit(SOCKET_EVENT.ENTER_GAME, dto, enterGame);
            setActive(false);
        }

        const weAreFriend = async () => {
	        await api.post(`/user/friends?nickname=${msg.author}`);
            let dto :SocketInputDto = {
                author :mySocket.name,
                target :msg.author,
                message :"ok"
            };
            mySocket.socket.emit(SOCKET_EVENT.RESFRIEND, dto, setReceivedMsg);
            setActive(false);
        }
        const weAreNotFriend = () => {
            let dto :SocketInputDto = {
                author :mySocket.name,
                target :msg.author,
            };
            mySocket.socket.emit(SOCKET_EVENT.RESFRIEND, dto, setReceivedMsg);
            setActive(false);
        }
        return (
            <Row className={
                    msg.author === mySocket.name
                    ? "m-0 p-0 pb-1 h-auto justify-content-end"
                    : "m-0 p-0 pb-1 h-auto"
                }>
                {
                    msg.author !== mySocket.name
                    &&  <>
                            <OverlayTrigger
                                key={'right'}
                                placement={'right'}
                                show={show}
                                overlay={
                                    <Popover id={`popover-positioned-${'right'}`}>
                                        <Popover.Body>
                                            <Button variant="outline-dark" className="w-100 p-3 my-1" onClick={showProfile}>프로필 보기</Button>
                                            {
                                                isFriend
                                                ? <Button variant="outline-dark" className="w-100 p-3 my-1" onClick={delFriend}>친구 삭제</Button>
                                                : <Button variant="outline-dark" className="w-100 p-3 my-1" onClick={beFriend}>친구 추가</Button>
                                            }
                                        </Popover.Body>
                                    </Popover>
                                }
                                >
                                <Image roundedCircle 
                                src="/img/Anonymous.jpeg" 
                                style={{width: "50px", height: "50px"}} 
                                className="p-0 me-2" onClick={checkFriend}/>
                            </OverlayTrigger>
                        </>
                }
                <Card
                    className="d-flex h-auto w-75 p-0"
                    bg={msg.type === SOCKET_EVENT.DM ? "danger" : "secondary"}
                    text="white">
                    <Card.Header>
                        {
                            msg.type === SOCKET_EVENT.DM 
                            ? msg.author === mySocket.name ? `me -> ${msg.target}` : `${msg.author} -> me`
                            : `${msg.author}`
                        }
                    </Card.Header>
                    <Card.Text className="px-2"> {msg.message}</Card.Text>
                    {
                        msg.type === SOCKET_EVENT.INVITE && msg.author !== mySocket.name
                        && <Button variant="outline-dark" onClick={joinGame} disabled={!active}>참여하기</Button>
                    }
                    {
                        msg.type === SOCKET_EVENT.BEFRIEND
                        &&  <>
                                <Button variant="outline-dark" onClick={weAreFriend} disabled={!active}>수락</Button>
                                <Button variant="outline-dark" onClick={weAreNotFriend} disabled={!active}>거절</Button>
                            </>
                    }
                </Card>
            </Row>
        );
    }
}
