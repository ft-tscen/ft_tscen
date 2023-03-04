import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Layout from "./components/Layout";
import { Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./axios/api";
import { io, Socket } from 'socket.io-client'

interface MySocket {
	socket: Socket;
	name: string;
	enteredChannelName: string;
	enteredGameRoom: string;
}

export let myGameSocket: MySocket;

export function setGameSocket(newName: string) {
	myGameSocket = {
		socket: io(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/game`, {
			withCredentials: true,
			query: {
				nickname: newName,
			},
		}),
		name: newName,
		enteredChannelName: "",
		enteredGameRoom: "",
	};
}

function App() {
	const navigate = useNavigate();
	const [loggedIn, setLoggedIn] = useState(false);
	const [isChangedData, setChangedData] = useState(false);
	let [userData, setUserData] = useState({
		intraID: "",
		name: "",
		nickName: "",
		phone: "",
		verified: false,
	});

	const getUserData = async () => {
		try {
			const res = await api.get("/user/me");
			const { user } = res.data;
			const data = {
				intraID: user.intra,
				name: user.usual_full_name,
				nickName: user.nickname,
				phone: user.phone,
				verified: user.verified,
			};
			setUserData(data);
		} catch (e) {
			console.error(e);
		}
	};

	const intraLogin = async () => {
		try {
			const res = await api.get("/user/me");
			const { user } = res.data;
			const data = {
				intraID: user.intra,
				name: user.usual_full_name,
				nickName: user.nickname,
				phone: user.phone,
				verified: user.verified,
			};
			setLoggedIn(true);
			setUserData(data);
			myGameSocket === undefined && setGameSocket(data.intraID);
			if (data.nickName === null && data.phone === null) navigate("/profile");
		} catch (e) {
			setLoggedIn(false);
			setUserData({
				intraID: "",
				name: "",
				nickName: "",
				phone: "",
				verified: false,
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
