import axios from "axios";

export const api = axios.create({
	baseURL: `http://${process.env.REACT_APP_INTRA_SERVER_IP}:3001`,
	withCredentials: true,
});
