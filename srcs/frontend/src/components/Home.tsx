import { Container, Col, Row } from "react-bootstrap";
// import style from "../css/Home.module.css";
import Btn from "./Btn";
import ChatPart from "./chatting/ChatPart";

type HomeComponent = {
	isLoggedIn: boolean;
};

function Home({ isLoggedIn }: HomeComponent) {
	return (
		<Container fluid className="d-flex w-100 m-0 p-0" style={{ height:"auto" }}>
			<Row className="w-100 m-0">
				<Col md={3}>여기는 프로필이었나?</Col>
				<Col className="m-auto">
					<>
						<Row>
							<Col className="d-flex justify-content-center">
								<img src="./pong-logo.jpeg" alt="홈 이미지" />
							</Col>
						</Row>
						<Row>
							<Col className="d-flex justify-content-center">
								<Btn text="게임하기" disable={isLoggedIn} />
								{/* 게임 컴포넌트 들어올 자리 */}
							</Col>
						</Row>
						<Row>
							<Col className="d-flex justify-content-center">
								<Btn text="채팅하기" disable={isLoggedIn} />
							</Col>
						</Row>
					</>
				</Col>
				<Col md={3} className="h-100">
					<ChatPart/>
				</Col>
			</Row>
		</Container>
	);
}

// <div className={style.black_background}>
// 	<img className={style.img} src="./pong-logo.jpeg" alt="홈 이미지" />
// </div>
// <div className={style.buttonDiv}>
// 	<GameBtn />
// </div>
export default Home;
