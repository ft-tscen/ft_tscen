import React, { useEffect, useState } from "react";
import { api } from "../axios/api";

const LoginTest = () => {
	const [loggedIn, setloggedIn] = useState(false);
	const [intra, setIntra] = useState("");

	useEffect(() => {
		api
			.get("/user/me")
			.then((res) => {
				const { user } = res.data;
				setloggedIn(true);
				setIntra(user.intra);
			})
			.catch((e) => {
				setloggedIn(false);
				setIntra("-");
			});
	}, [loggedIn]);

	function login() {
		window.location.href = "http://localhost:3001/login";
	}

	async function logout() {
		await api.get("/logout");
		setloggedIn(false);
	}

	return (
		<div>
			<h1>Login Test</h1>
			<h4>Login: {loggedIn.toString()}</h4>
			<h4>User: {intra}</h4>
			<button onClick={login}>LogIn</button>
			<button onClick={logout}>LogOut</button>
		</div>
	);
};

export default LoginTest;
