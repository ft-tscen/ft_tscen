import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import { api } from "./axios/api";

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
				<Route
					path="/*"
					element={
						<Layout
							isLoggedIn={loggedIn}
							userData={userData}
							setUserData={setUserData}
						/>
					}
				/>
			</Routes>
		</>
	);
}

export default App;