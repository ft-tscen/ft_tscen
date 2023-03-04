import {
	Container,
	Col,
	Row,
	Image,
	Card,
	ListGroup,
	Stack,
	Form,
} from "react-bootstrap";

type InformComponent = {
	userData: {
		intraID: string;
		name: string;
		nickName: string;
		phone: string;
		verified: boolean;
	};
};

function Inform({ userData }: InformComponent) {
	const getNickName = () => {
		if (userData.nickName.length > 15)
			return userData.nickName.slice(0, 7) + "...";
		else return userData.nickName;
	};
	return (
		<>
			<Stack gap={5} className="mt-5" style={{ height: "40vmin" }}>
				<Container>
					<Row>
						<Col className="d-flex justify-content-center align-items-center">
							<Image
								src="./profile.jpeg"
								roundedCircle
								style={{ width: "15vmin" }}
							/>
						</Col>
					</Row>
				</Container>
				<Container>
					<Card className="bg-transparent border p-2">
						<Card.Body>
							<Form>
								<Form.Group className="mb-2" controlId="formIntraID">
									<Form.Label className="text-white">인트라 ID</Form.Label>
									<Form.Control
										type="text"
										placeholder="Intra ID"
										className="bg-transparent text-white"
										value={`${userData.intraID}`}
										disabled
									/>
								</Form.Group>
								<Form.Group className="mb-2" controlId="formName">
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
										<Form.Group className="mb-2" controlId="formNickName">
											<Form.Label className="text-white">닉네임</Form.Label>
											<Form.Control
												type="text"
												placeholder="Nickname"
												className="bg-transparent text-white"
												value={userData.nickName}
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

export default Inform;

/* <Container fluid className="mt-4" style={{ height: "10vmin" }}>
<Row>
	<Col className="d-flex justify-content-center align-items-center">
		<Image
			src="./profile.jpeg"
			roundedCircle
			style={{ width: "15vmin" }}
		/>
	</Col>
</Row>
</Container> */
