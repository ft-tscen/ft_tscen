import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import { api } from "./axios/api";

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [intra, setIntra] = useState("");

	const intraLogin = async () => {
		try {
			const res = await api.get("/user/me");
			const { user } = res.data;
			setLoggedIn(true);
			setIntra(user.intra);
			console.log(user.intra);
		} catch (e) {
			setLoggedIn(false);
			setIntra("-");
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
			</Routes>
		</>
	);
}

export default App;
