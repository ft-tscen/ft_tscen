import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Layout from "./components/Layout";
import { Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./axios/api";
import { BoolType, UserData } from "./common/types";
import {
	mySocket,
	myGameSocket,
	SetSocket,
	setGameSocket,
} from "./common/MySocket";

function App() {
	const navigate = useNavigate();
	const [loggedIn, setLoggedIn]: BoolType = useState<boolean>(false);
	let [userData, setUserData] = useState<UserData>({
		intra: "",
		usual_full_name: "",
		nickname: "",
		phone: "",
		verified: false,
		avatarId: 0,
	});
	const [isChangedData, setChangedData]: BoolType = useState<boolean>(false);

	const getUserData = async () => {
		try {
			const res = await api.get("/user/me");
			const { user } = res.data;
			const data: UserData = {
				intra: user.intra,
				usual_full_name: user.usual_full_name,
				nickname: user.nickname,
				phone: user.phone,
				verified: user.verified,
				avatarId: user.avatarId,
			};
			setUserData(data);
			mySocket.name = user.nickname;
		} catch (e) {
			console.error(e);
		}
	};

	const intraLogin = async () => {
		try {
			const res = await api.get("/user/me");
			const { user } = res.data;
			const data: UserData = {
				intra: user.intra,
				usual_full_name: user.usual_full_name,
				nickname: user.nickname,
				phone: user.phone,
				verified: user.verified,
				avatarId: user.avatarId,
			};
			setLoggedIn(true);
			setUserData(data);
			mySocket === undefined && SetSocket(data.nickname);
			myGameSocket === undefined && setGameSocket(data.nickname);
			
			if (data.nickname === null && data.phone === null) navigate("/profile");
		} catch (e) {
			setLoggedIn(false);
			setUserData({
				intra: "",
				usual_full_name: "",
				nickname: "",
				phone: "",
				verified: false,
				avatarId: 0,
			});
		}
	};

	useEffect(() => {
		intraLogin();
	}, [loggedIn]);

	useEffect(() => {
		getUserData();
	}, [isChangedData]);

	return (
		<>
			<NavBar isLoggedIn={loggedIn} setLoggedIn={setLoggedIn} />
			<Routes>
				<Route
					path="/*"
					element={
						<Layout
							isLoggedIn={loggedIn}
							userData={userData}
							isChangedData={isChangedData}
							setChangedData={setChangedData}
						/>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
