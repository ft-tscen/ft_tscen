import { Col, Row } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import Game from "./game/Game"
import { gameMod } from "./game/GameType";

type LayoutComponent = {
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

function Layout({ isLoggedIn, userData, setUserData }: LayoutComponent) {
	const url = useParams();
	const param = url["*"];

	const getComponent = () => {
		if (param === "") return <Home isLoggedIn={isLoggedIn} />;
		else if (param === "profile")
			return (
				<Profile
					isLoggedIn={isLoggedIn}
					userData={userData}
					setUserData={setUserData}
				/>
			);
		else if (param === "soloGame")
			return ( <Game mod={gameMod.soloGame} /> );
		else if (param === "rankGame")
			return ( <Game mod={gameMod.rankGame} /> );
	};
	return (
		<>
			<Container fluid style={{ height: "90vmin" }}>
				<Row style={{ height: "90vmin" }}>
					<Col xs={3}>
						<div>adsf</div>
						{/* 정보 컴포넌트 들어올 자리 */}
					</Col>
					<Col xs={6}>{getComponent()}</Col>
					<Col xs={3}>
						<div>asdf</div>
						{/* 채팅 컴포넌트 들어올 자리 */}
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Layout;
