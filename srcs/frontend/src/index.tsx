import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import { io } from "socket.io-client";

export const socket = io(`http://${process.env.REACT_APP_BACKEND_HOST}:3001`);

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);
