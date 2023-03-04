import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Layout from "./components/Layout";
import { Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./axios/api";
import { UserData } from "./common/types";
import { mySocket, SetSocket } from "./common/MySocket";
import { io, Socket } from "socket.io-client";

interface MySocket {
	socket: Socket;
	name: string;
	enteredChannelName: string;
	enteredGameRoom: string;
}

export let myChatSocket: MySocket;
export let myGameSocket: MySocket;

export function setChatSocket(newName: string) {
	myChatSocket = {
		socket: io(
			`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/chat`,
			{
				withCredentials: true,
				query: {
					nickname: newName,
				},
			}
		),
		name: newName,
		enteredChannelName: "",
		enteredGameRoom: "",
	};
}

export function setGameSocket(newName: string) {
	myGameSocket = {
		socket: io(
			`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/game`,
			{
				withCredentials: true,
				query: {
					nickname: newName,
				},
			}
		),
		name: newName,
		enteredChannelName: "",
		enteredGameRoom: "",
	};
}

function App() {
	const navigate = useNavigate();
	const [loggedIn, setLoggedIn] = useState(false);
	let [userData, setUserData] = useState<UserData>({
		intraID: "",
		name: "",
		nickName: "",
		phone: "",
		verified: false,
	});
	const [imageDataUrl, setImageDataUrl] = useState<string>("");
	const [isChangedData, setChangedData] = useState<boolean>(false);

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
			try {
				const response = await api.get(`/user/avatar/${user.avatarId}`, {
					responseType: "arraybuffer",
				});
				const arrayBufferView = new Uint8Array(response.data);
				const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
				const urlCreator = window.URL || window.webkitURL;
				const imageUrl = urlCreator.createObjectURL(blob);
				setImageDataUrl(imageUrl);
			} catch (e) {
				console.error(e);
			} finally {
				setUserData(data);
				mySocket.name = user.nickname;
			}
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
			try {
				const response = await api.get(`/user/avatar/${user.avatarId}`, {
					responseType: "arraybuffer",
				});
				const arrayBufferView = new Uint8Array(response.data);
				const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
				const urlCreator = window.URL || window.webkitURL;
				const imageUrl = urlCreator.createObjectURL(blob);
				setImageDataUrl(imageUrl);
			} catch (e) {
				console.error(e);
			} finally {
				setLoggedIn(true);
				setUserData(data);
				mySocket === undefined && SetSocket(data.intraID);
				if (data.nickName === null && data.phone === null) navigate("/profile");
			}
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
							imageURL={imageDataUrl}
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
