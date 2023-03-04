import { Col, Row, Button } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// import style from "../css/Home.module.css";
// import Btn from "./Btn";

enum gameMod {
	normalGame,
	passwordGame,
	soloGame,
	rankGame,
}

type HomeComponent = {
	isLoggedIn: boolean;
};

function Home({ isLoggedIn }: HomeComponent) {
	const navigate = useNavigate();

	function gameModHandle(mode: gameMod) {
		if (mode === gameMod.normalGame) {
			navigate("/creatGame");
		} else if (mode === gameMod.rankGame) {
			navigate("/rankGame");
		} else if (mode === gameMod.soloGame) {
			navigate("/soloGame");
		}
	}

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
						<Button
							variant="outline-light"
							disabled={!isLoggedIn}
							style={{ width: "100px", height: "50px" }}
							onClick={() => gameModHandle(gameMod.normalGame)}
						>
							방만들기
						</Button>
					</Col>
				</Row>
				<Row>
					<p> </p>
				</Row>
				<Row>
					<Col className="d-flex justify-content-center">
						<Button
							variant="outline-light"
							disabled={!isLoggedIn}
							style={{ width: "100px", height: "50px" }}
							onClick={() => gameModHandle(gameMod.rankGame)}
						>
							경쟁전
						</Button>
					</Col>
				</Row>
				<p> </p>
				<Row>
					<Col className="d-flex justify-content-center">
						<Button
							variant="outline-light"
							disabled={!isLoggedIn}
							style={{ width: "100px", height: "50px" }}
							onClick={() => gameModHandle(gameMod.soloGame)}
						>
							혼자하기
						</Button>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Home;
