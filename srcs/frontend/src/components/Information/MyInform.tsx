import { useEffect, useState } from "react";
import {
	Container,
	Col,
	Row,
	Image,
	Card,
	Stack,
	Form,
	Button,
	ListGroup,
} from "react-bootstrap";
import { api } from "../../axios/api";
import { mySocket } from "../../common/MySocket";
import { GameData, UserData } from "../../common/types";
import Friends from "../Friends";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

type Record = {
	timestamp: string;
	nickname: string;
	isRank: boolean;
	isWin: boolean;
};

type InformComponent = {
	inform: UserData;
	setInform: React.Dispatch<React.SetStateAction<UserData | undefined>>;
	myData: UserData;
	gameData: GameData[] | undefined;
};

function MyInform({ inform, setInform, myData, gameData }: InformComponent) {
	const [imageURL, setImageURL] = useState("");
	//const [refresh, setRefresh] = useState(false);
	const [show, setShow] = useState(false);
	const [myFriends, setMyFriends] = useState([]);
	const handleClose = () => setShow(false);
	const handleShow = () => {
		setShow(true);
		getMyFriends();
	};

	const getAvatar = async () => {
		if (inform.avatarId) {
			try {
				const response = await api.get(`/user/avatar/${inform.avatarId}`, {
					responseType: "arraybuffer",
				});
				const arrayBufferView = new Uint8Array(response.data);
				const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
				const urlCreator = window.URL || window.webkitURL;
				const imageUrl = urlCreator.createObjectURL(blob);
				setImageURL(imageUrl);
			} catch (e) {
				setImageURL("./Anonymous.jpeg");
			}
		} else {
			setImageURL("./Anonymous.jpeg");
		}
	};

	const getMyData = () => {
		setInform(myData);
	};

	const isDisable_back = () => {
		if (inform.nickname !== mySocket.name) return false;
		return true;
	};

	const isDisable_friends = () => {
		if (inform.nickname !== mySocket.name) return true;
		return false;
	};

	const getMyFriends = async () => {
		try {
			const res = await api.get("/user/friends");
			const { friends } = res.data;
			setMyFriends(friends);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		getAvatar();
	}, [inform]);
	return (
		<>
			<Container className="d-flex justify-content-between">
				<Button
					className="mt-3"
					variant="outline-light"
					onClick={getMyData}
					disabled={isDisable_back()}
				>
					◀️
				</Button>
				<Button
					className="mt-3"
					variant="outline-light"
					onClick={handleShow}
					disabled={isDisable_friends()}
				>
					친구 목록
				</Button>
				<Friends show={show} handleClose={handleClose} friends={myFriends} />
			</Container>
			<Stack gap={5} className="mt-5" style={{ height: "40vmin" }}>
				<Container>
					<Row>
						<Col className="vh-15 d-flex justify-content-center align-items-center">
							<Image
								src={imageURL}
								roundedCircle
								style={{ width: "15vmin", height: "15vmin" }}
							/>
						</Col>
					</Row>
				</Container>
				<Container>
					<Card className="bg-transparent border-top p-2">
						<Card.Body>
							<Form>
								<Form.Group className="mb-2" controlId="formIntraID">
									<Form.Label className="text-white">인트라 ID</Form.Label>
									<Form.Control
										type="text"
										placeholder="Intra ID"
										className="bg-transparent text-white"
										value={inform.intra}
										disabled
									/>
								</Form.Group>
								<Form.Group className="mb-2" controlId="formName">
									<Form.Label className="text-white">이름</Form.Label>
									<Form.Control
										type="text"
										placeholder="Name"
										className="bg-transparent text-white"
										value={inform.usual_full_name}
										disabled
									/>
								</Form.Group>
								<Row>
									<Col>
										<Form.Group className="mb-2" controlId="formNickName">
											<Form.Label className="text-white">닉네임</Form.Label>
											<Form.Control
												type="text"
												placeholder="Nickname"
												className="bg-transparent text-white"
												value={inform.nickname}
												disabled
											/>
										</Form.Group>
									</Col>
								</Row>
							</Form>
						</Card.Body>
					</Card>
					<Form.Group
						className="mb-2 mt-5 d-flex justify-content-between"
						controlId="formName"
					>
						<Form.Label className="text-white">
							최근 전적(최대 30게임)
						</Form.Label>
						<Button variant="outline-light" onClick={() => getMyFriends()}>
							<FontAwesomeIcon icon={faArrowsRotate} />
						</Button>
					</Form.Group>
					{gameData && gameData.length === 0 ? (
						<Container
							style={{ height: "30vmin", overflowY: "scroll" }}
							className="d-flex justify-content-center align-items-center"
						>
							<span className="fw-bold text-white">게임 전적이 없습니다!</span>
						</Container>
					) : (
						<Container style={{ height: "30vmin", overflowY: "scroll" }}>
							<Card className="border-0">
								<Card.Body className="p-0">
									<ListGroup variant="flush">
										{gameData &&
											gameData.map((res: GameData, index: any) => (
												<>
													<ListGroup.Item
														key={index}
														className="py-2"
														style={{ backgroundColor: "black" }}
													>
														<span className="fw-bold">{res.timestamp}</span>
														<span className="ms-2 text-muted fw-bold ">
															{res.isRank ? "랭킹전 " : "친선전 "}
														</span>
														<span className="ms-2 text-white fw-bold">
															{res.nickname.slice(0, 10)}
														</span>
														<span className="text-white float-end">
															{res.isWin ? "🏆승리🏆" : "패배"}
														</span>
													</ListGroup.Item>
												</>
											))}
									</ListGroup>
								</Card.Body>
							</Card>
						</Container>
					)}
				</Container>
			</Stack>
		</>
	);
}

export default MyInform;
