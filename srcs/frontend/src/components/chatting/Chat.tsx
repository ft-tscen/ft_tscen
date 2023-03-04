import { useState } from "react";
import { Card, Row, Image, OverlayTrigger, Popover } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { api } from "../../axios/api";
import { mySocket } from "../../common/MySocket";
import {
	SocketInputDto,
	SocketOutputDto,
	SOCKET_EVENT,
} from "../../common/types";

type ArgsType = {
	msg: SocketOutputDto;
	enterGame: (dto: SocketOutputDto) => void;
};

type FlagType = [
	isFriend: boolean,
	setIsFriend: React.Dispatch<React.SetStateAction<boolean>>
];
type ShowType = [
	show: boolean,
	setShow: React.Dispatch<React.SetStateAction<boolean>>
];

export function Chat({ msg, enterGame }: ArgsType) {
	let [isFriend, setIsFriend]: FlagType = useState<boolean>(false);
	let [show, setShow]: ShowType = useState<boolean>(false);

	if (msg.author === "server") {
		return (
			<Row className="m-0 p-0 pb-1 h-auto text-left justify-content-center">
				<pre style={{ color: "red", whiteSpace: "pre-line" }}>
					{msg.message}
				</pre>
				<hr style={{ color: "red" }} />
			</Row>
		);
	} else {
		const checkFriend = async () => {
			const res = await api.get(`/user/friends`);
			if (res.data.friends.includes(msg.author)) setIsFriend(true);
			setIsFriend(false);
			show ? setShow(false) : setShow(true);
		};
		const beFriend = async () => {
			await api.post(`/user/friends?nickname=${msg.author}`);
			setShow(false);
		};
		const delFriend = async () => {
			await api.delete(`/user/friends?nickname=${msg.author}`);
			setShow(false);
		};
		const showProfile = () => {
			console.log("누른 상대 프로필 보기");
			setShow(false);
		};
		const joinGame = () => {
			console.log("초대한 게임에 참여함");
			let dto: SocketInputDto = {
				author: mySocket.name,
				target: msg.target,
			};
			mySocket.socket.emit(SOCKET_EVENT.ENTER_GAME, dto, enterGame);
		};
		return (
			<Row
				className={
					msg.author === mySocket.name
						? "m-0 p-0 pb-1 h-auto justify-content-end"
						: "m-0 p-0 pb-1 h-auto"
				}
			>
				{msg.author !== mySocket.name && (
					<>
						<OverlayTrigger
							key={"right"}
							placement={"right"}
							show={show}
							overlay={
								<Popover id={`popover-positioned-${"right"}`}>
									<Popover.Body>
										<Button
											variant="outline-dark"
											className="w-100 p-3 my-1"
											onClick={showProfile}
										>
											프로필 보기
										</Button>
										{isFriend ? (
											<Button
												variant="outline-dark"
												className="w-100 p-3 my-1"
												onClick={delFriend}
											>
												친구 삭제
											</Button>
										) : (
											<Button
												variant="outline-dark"
												className="w-100 p-3 my-1"
												onClick={beFriend}
											>
												친구 추가
											</Button>
										)}
									</Popover.Body>
								</Popover>
							}
						>
							<Image
								roundedCircle
								src="/img/Anonymous.jpeg"
								style={{ width: "50px", height: "50px" }}
								className="p-0 me-2"
								onClick={checkFriend}
							/>
						</OverlayTrigger>
					</>
				)}
				<Card
					className="d-flex h-auto w-75 p-0"
					bg={msg.type === SOCKET_EVENT.DM ? "danger" : "secondary"}
					text="white"
				>
					<Card.Header>
						{msg.type === SOCKET_EVENT.DM
							? msg.author === mySocket.name
								? `me -> ${msg.target}`
								: `${msg.author} -> me`
							: `${msg.author}`}
					</Card.Header>
					<Card.Text className="px-2"> {msg.message}</Card.Text>
					{msg.type === SOCKET_EVENT.INVITE && msg.author !== mySocket.name && (
						<Button variant="outline-dark" onClick={joinGame}>
							참여하기
						</Button>
					)}
				</Card>
			</Row>
		);
	}
}
