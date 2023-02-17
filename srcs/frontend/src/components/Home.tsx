import { Container, Col, Row } from "react-bootstrap";
import Btn from "./Btn";

type HomeComponent = {
	isLoggedIn: boolean;
};

function Home({ isLoggedIn }: HomeComponent) {
	return (
		<>
			<Container>
				<Row>
					<Col className="d-flex justify-content-center">
						<img src="./pong-logo.jpeg" alt="홈 이미지" width="90%" />
					</Col>
				</Row>
				<Row>
					<Col className="d-flex justify-content-center">
						<Btn text="게임하기" disable={isLoggedIn} />
						{/* 게임 컴포넌트 들어올 자리 */}
					</Col>
				</Row>
				<Row>
					<p> </p>
				</Row>
				<Row>
					<Col className="d-flex justify-content-center">
						<Btn text="채팅하기" disable={isLoggedIn} />
						{/* 채팅 컴포넌트 들어올 자리 */}
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Home;