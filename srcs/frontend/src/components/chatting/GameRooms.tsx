import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { GameRoom } from "./GameRoom";
import { GameRoomType, SocketOutputDto, SOCKET_EVENT } from "../../common/types";
import { mySocket } from "../../common/MySocket";
import "./Effect.css";

type GameRoomListType = [
    gameRoomList: GameRoomType[],
    setGameRoomList: React.Dispatch<React.SetStateAction<GameRoomType[]>>
];

export function GameRooms() {
    let [gameRoomList, setGameRoomList] : GameRoomListType = useState<GameRoomType[]>([]);

    useEffect(() => {
        mySocket.socket.emit(SOCKET_EVENT.GET_GAMEROOM, setGameRoomList);
    }, []);

	return (
		<Container className="m-0 p-0 mb-auto Scrollable" style={{ height:"81vmin" }}>
        {
            gameRoomList.map((obj :GameRoomType, idx :number) => {
                return (
                    <GameRoom key={idx} obj={obj}/>
                );
            })
        }
        </Container>
	);
}