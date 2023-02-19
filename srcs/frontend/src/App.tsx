import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Game from "./components/game/Game";
import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import { api } from "./axios/api";

enum gameMod{
	normalGame,
	passwordGame,
	soloGame,
	rankGame,
}

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	let [userData, setUserData] = useState({
		intraID: "",
		name: "",
		nickName: "",
		phone: "",
		verified: false,
	});

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
	return (
		<>
			<NavBar isLoggedIn={loggedIn} setLoggedIn={setLoggedIn} />
			<Routes>
				<Route path="/" element={<Home isLoggedIn={loggedIn} />} />
				<Route path="/soloGame" element={<Game mod={gameMod.soloGame} />} />
				<Route path="/rankGame" element={<Game mod={gameMod.rankGame} />} />
			</Routes>
		</>
	);
}

export default App;
