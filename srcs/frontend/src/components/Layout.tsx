import { Col, Row, Container } from "react-bootstrap";
import ChatPart from "./chatting/ChatPart";
import { useNavigate, useParams } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile/Profile";
import MyInform from "./Information/MyInform";
import OtherInform from "./Information/OtherInform";

type LayoutComponent = {
	isLoggedIn: boolean;
	userData: {
		intraID: string;
		name: string;
		nickName: string;
		phone: string;
		verified: boolean;
	};
	imageURL: string;
	isChangedData: boolean;
	setChangedData: React.Dispatch<React.SetStateAction<boolean>>;
};

function Layout({
	isLoggedIn,
	userData,
	imageURL,
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

	const getBorder = () => {
		if (isLoggedIn) return "border";
		else return "";
	};
	return (
		<>
			<Container fluid style={{ height: "90vmin" }}>
				<Row style={{ height: "90vmin" }}>
					<Col xs={3} className={getBorder()}>
						{userData.nickName === null || !isLoggedIn ? null : (
							<MyInform userData={userData} imageURL={imageURL} />
							// <OtherInform userData={userData} imageURL={imageURL} />
						)}
					</Col>
					<Col xs={6}>{getComponent()}</Col>
					<Col xs={3} className={getBorder()}>
						{isLoggedIn && <ChatPart />}
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Layout;
