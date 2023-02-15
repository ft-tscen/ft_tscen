import { Col, Row } from "react-bootstrap";
import { Container } from "react-bootstrap";
// import style from "../css/Home.module.css";
import Btn from "./Btn";
import Game from "./game/Game";

type HomeComponent = {
	isLoggedIn: boolean;
};

function Home({ isLoggedIn }: HomeComponent) {
	return (
		<>
			<Container>
				<Game/>
			</Container>
		</>
	);
}

// <div className={style.black_background}>
// 	<img className={style.img} src="./pong-logo.jpeg" alt="홈 이미지" />
// </div>
// <div className={style.buttonDiv}>
// 	<GameBtn />
// </div>
export default Home;
