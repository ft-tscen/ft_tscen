import { Col, Row } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Home from "./Home";
import Game from "./game/Game"
import { gameMod } from "./game/GameType";
import CreatRoom from "./Room";
import Profile from "./Profile/Profile";

type LayoutComponent = {
	isLoggedIn: boolean;
	userData: {
		intraID: string;
		name: string;
		nickName: string;
		phone: string;
		verified: boolean;
	};
	isChangedData: boolean;
	setChangedData: (isChangedData: boolean) => any;
};

function Layout({
	isLoggedIn,
	userData,
	isChangedData,
	setChangedData,
}: LayoutComponent) {
	const url = useParams();
	const param = url["*"];
	const navigate = useNavigate();

	const getComponent = () => {
		if (param === "") return <Home isLoggedIn={isLoggedIn} />;
		else if (param === "profile")
			return (
				<Profile
					isLoggedIn={isLoggedIn}
					userData={userData}
					isChangedData={isChangedData}
					setChangedData={setChangedData}
				/>
			);
		else if (param === "soloGame")
			return ( <Game mod={gameMod.soloGame} /> );
		else if (param === "rankGame")
			return ( <Game mod={gameMod.rankGame} /> );
		else if (param === "creatGame")
			return ( <CreatRoom /> );

	};
	return (
		<>
			<Container fluid style={{ height: "90vmin" }}>
				<Row style={{ height: "90vmin" }}>
					<Col xs={3}>
						{userData.nickName === null || !isLoggedIn ? null : <div>asdf</div>}
						{/* 정보 컴포넌트 들어올 자리 */}
					</Col>
					<Col xs={6}>{getComponent()}</Col>
					<Col xs={3}>
						{userData.nickName === null || !isLoggedIn ? null : <div>asdf</div>}
						{/* 채팅 컴포넌트 들어올 자리 */}
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Layout;
