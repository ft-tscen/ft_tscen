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
	Offcanvas,
} from "react-bootstrap";
import { api } from "../../axios/api";
import { mySocket } from "../../common/MySocket";
import { UserData } from "../../common/types";
import Friends from "../Friends";

type InformComponent = {
	inform: UserData;
	setInform: React.Dispatch<React.SetStateAction<UserData | undefined>>;
	myData: UserData;
};

function MyInform({ inform, setInform, myData }: InformComponent) {
	const [imageURL, setImageURL] = useState("");
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
				</Container>
			</Stack>
		</>
	);
}

export default MyInform;
