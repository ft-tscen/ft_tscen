import { useEffect, useState } from "react";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api } from "../axios/api";

type ProfileComponent = {
	isLoggedIn: boolean;
	userData: {
		intraID: string;
		name: string;
		nickName: string;
		phone: string;
		verified: boolean;
	};
	setUserData: (userData: {
		intraID: string;
		name: string;
		nickName: string;
		phone: string;
		verified: boolean;
	}) => any;
};

function Profile({ isLoggedIn, userData, setUserData }: ProfileComponent) {
	const navigate = useNavigate();
	const [nick_name, setNickName] = useState(userData.nickName);
	const [phone_number, setPhoneNumber] = useState(userData.phone);
	const [isDuplicated, setDuplicated] = useState("no_check");
	const [isCertificated, setCertificated] = useState(false);
	const [edit, setEdit] = useState(false);

	const checkDuplicate = async () => {
		if (nick_name === null || nick_name === "" || nick_name === undefined)
			return;
		else {
			if (userData.nickName === nick_name) setDuplicated("same");
			else {
				try {
					const res = await api.get(`/user/check?nickname=${nick_name}`);
					const { ok } = res.data;
					setDuplicated(`${!ok}`);
				} catch (e) {
					console.log(e);
				}
			}
		}
	};

	const getDuplicateResult = () => {
		if (isDuplicated === "no_check" || isDuplicated === "same") return "";
		else if (isDuplicated === "true") return "❌";
		else return "✅";
	};

	const handleCertificate = async () => {
		if (!isCertificated) {
			if (
				phone_number === null ||
				phone_number === "" ||
				phone_number === undefined
			)
				alert("☎️ 전화번호를 입력해주세요.");
			else setCertificated(true);
		} else {
			setCertificated(false);
		}
	};

	const handleSubmit = async () => {
		if (isDuplicated === "same" || isDuplicated === "false") {
			try {
				const res = await api.patch("http://localhost:3001/user/update", {
					nickname: nick_name,
					phone: phone_number,
					verified: isCertificated,
				});
				setUserData({
					intraID: userData.intraID,
					name: userData.name,
					nickName: nick_name,
					phone: phone_number,
					verified: isCertificated,
				});
				console.log(res.data);
				navigate("/");
			} catch (e) {
				console.error(e);
			}
		} else {
			alert("닉네임 중복 체크를 해주세요");
		}
	};

	useEffect(() => {}, [edit]);
	if (isLoggedIn) {
		if (edit === true) {
			return (
				<Container className="pt-5">
					<Card className="bg-transparent border p-3">
						<Card.Body>
							<Card.Title className="text-white">프로필</Card.Title>
							<Form className="border-top p-4" encType="multipart/form-data">
								{/* <Form.Group className="mb-3" controlId="formAvatar">
									<Form.Label className="text-white">프로필 사진</Form.Label>
									<Form.Control
										type="file"
										placeholder="Intra ID"
										className="bg-transparent text-white"
									/>
								</Form.Group> */}
								<Form.Group className="mb-3" controlId="formIntraID">
									<Form.Label className="text-white">인트라 ID</Form.Label>
									<Form.Control
										type="text"
										placeholder="Intra ID"
										className="bg-transparent text-white"
										value={`${userData.intraID}`}
										disabled
									/>
								</Form.Group>
								<Form.Group className="mb-3" controlId="formName">
									<Form.Label className="text-white">이름</Form.Label>
									<Form.Control
										type="text"
										placeholder="Name"
										className="bg-transparent text-white"
										value={`${userData.name}`}
										disabled
									/>
								</Form.Group>
								<Row className="d-flex">
									<Col xs={9}>
										<Form.Group className="mb-3" controlId="formNickName">
											<Form.Label className="text-white">닉네임</Form.Label>
											<Form.Control
												type="text"
												placeholder="Nickname"
												className="bg-transparent text-white"
												value={nick_name === null ? "" : nick_name}
												onChange={(e) => setNickName(e.target.value)}
											/>
										</Form.Group>
									</Col>
									<Col xs="auto" className="mt-4 pt-2">
										<Button variant="outline-light" onClick={checkDuplicate}>
											체크
										</Button>
									</Col>
									<Col xs="auto" className="mt-4 pt-3">
										{getDuplicateResult()}
									</Col>
								</Row>
								<Form.Group className="mb-3" controlId="formPhoneNumber">
									<Form.Label className="text-white">전화번호</Form.Label>
									<Form.Control
										type="tel"
										placeholder="'-' 없이 숫자만 입력"
										pattern="[0-9]{3}[0-9]{4}[0-9]{4}"
										className="bg-transparent text-white"
										value={phone_number === null ? "" : phone_number}
										onChange={(e) => setPhoneNumber(e.target.value)}
									/>
								</Form.Group>
								<Form.Check
									type="switch"
									id="custom-switch"
									label="2차 인증"
									className="text-white"
									onChange={handleCertificate}
									checked={isCertificated}
									name="verified"
								/>
								<Container className="pt-3">
									<Row className="mt-3">
										<Button variant="outline-light" onClick={handleSubmit}>
											저장하기
										</Button>
									</Row>
								</Container>
							</Form>
						</Card.Body>
					</Card>
				</Container>
			);
		} else {
			return (
				<Container className="pt-5">
					<Card className="bg-transparent border p-3">
						<Card.Body>
							<Card.Title className="text-white">프로필</Card.Title>
							<Form className="border-top p-4" encType="multipart/form-data">
								{/* <Form.Group className="mb-3" controlId="formAvatar">
									<Form.Label className="text-white">프로필 사진</Form.Label>
									<Form.Control
										type="file"
										placeholder="Intra ID"
										className="bg-transparent text-white"
									/>
								</Form.Group> */}
								<Form.Group className="mb-3" controlId="formIntraID">
									<Form.Label className="text-white">인트라 ID</Form.Label>
									<Form.Control
										type="text"
										placeholder="Intra ID"
										className="bg-transparent text-white"
										value={`${userData.intraID}`}
										disabled
									/>
								</Form.Group>
								<Form.Group className="mb-3" controlId="formName">
									<Form.Label className="text-white">이름</Form.Label>
									<Form.Control
										type="text"
										placeholder="Name"
										className="bg-transparent text-white"
										value={`${userData.name}`}
										disabled
									/>
								</Form.Group>
								<Row>
									<Col>
										<Form.Group className="mb-3" controlId="formNickName">
											<Form.Label className="text-white">닉네임</Form.Label>
											<Form.Control
												type="text"
												placeholder="Nickname"
												className="bg-transparent text-white"
												value={nick_name === null ? "" : nick_name}
												onChange={(e) => setNickName(e.target.value)}
												disabled
											/>
										</Form.Group>
									</Col>
								</Row>
								<Form.Group className="mb-3" controlId="formPhoneNumber">
									<Form.Label className="text-white">전화번호</Form.Label>
									<Form.Control
										type="tel"
										placeholder="'-' 없이 숫자만 입력"
										pattern="[0-9]{3}[0-9]{4}[0-9]{4}"
										className="bg-transparent text-white"
										value={phone_number === null ? "" : phone_number}
										onChange={(e) => setPhoneNumber(e.target.value)}
										disabled
									/>
								</Form.Group>
								<Form.Check
									type="switch"
									id="custom-switch"
									label="2차 인증"
									className="text-white"
									onChange={handleCertificate}
									checked={isCertificated}
									disabled
								/>
								<Container className="pt-3">
									<Row className="mt-3">
										<Button
											variant="outline-light"
											onClick={() => setEdit(true)}
										>
											변경하기
										</Button>
									</Row>
								</Container>
							</Form>
						</Card.Body>
					</Card>
				</Container>
			);
		}
	} else navigate("/");
	return null;
}

export default Profile;
