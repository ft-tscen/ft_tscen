import { Col, Row, Container } from "react-bootstrap";
import ChatPart from "./chatting/ChatPart";
import { useNavigate, useParams } from "react-router-dom";
import Home from "./Home";
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
		else navigate("/");
	};
	return (
		<>
			<Container fluid style={{ height: "90vmin" }}>
				<Row style={{ height: "90vmin" }}>
					<Col xs={3} className="border">{/* disable={isLoggedIn}> */}
						<div>adsf</div>
						{/* 정보 컴포넌트 들어올 자리 */}
					</Col>
					<Col xs={6}>{getComponent()}</Col>
					<Col xs={3} className="border">{/* disable={isLoggedIn}> */}
						<ChatPart/>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Layout;
