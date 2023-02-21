import axios from "axios";

export const api = axios.create({
	baseURL: `http://${process.env.REACT_APP_NESTJS_HOST}:3001`,
	withCredentials: true,
});
