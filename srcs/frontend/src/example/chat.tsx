import {
	ChangeEvent,
	FormEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001/chat", { withCredentials: true,  query: {
    nickname: 'donghyun'
  } });

console.log("");
export interface ChatDto {
	author: string;
	target: string;
	message: string;
  }

const LiveChat = () => {
	const [chats, setChats] = useState<ChatDto[]>([]);
	const [message, setMessage] = useState<string>("");
	const chatContainer = useRef<HTMLDivElement>(null);

	// 스크롤 위치 조정
	useEffect(() => {
		if (!chatContainer.current) return;
		const { scrollHeight, clientHeight } = chatContainer.current;
		if (scrollHeight > clientHeight) {
			chatContainer.current.scrollTop = scrollHeight - clientHeight;
		}
	}, [chats.length]);

	// 채팅 수신
	useEffect(() => {
		const messageHandler = (chat: ChatDto) =>
			setChats((prevChats) => [...prevChats, chat]);
		socket.on("channel-msg", messageHandler);
		return () => {
			socket.off("channel-msg", messageHandler);
		};
	}, []);

	const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);
	}, []);

	const onSendMessage = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!message) return alert("메시지를 입력해 주세요.");
			socket.emit("channel-msg", {author: socket.id, target: socket.id ,message}, (chat: ChatDto) => {
				setChats((prevChats) => [...prevChats, chat]);
				setMessage("");
			});
		},
		[message]
	);

	return (
		<>
			<h1>WebSocket Chat</h1>
			<div
				ref={chatContainer}
				style={{
					display: "flex",
					flexDirection: "column",
					border: "1px solid #000",
					padding: "1rem",
					width: "400px",
					height: "300px",
					overflow: "auto",
					margin: "auto",
				}}
			>
				{chats.map((chat, index) => (
					<div key={index} style={{ marginBottom: "20px" }}>
						<div style={{ display: "flex" }}>ID: {chat.author}</div>
						<div style={{ display: "flex" }}>{chat.message}</div>
					</div>
				))}
			</div>
			<form onSubmit={onSendMessage}>
				<input type="text" onChange={onChange} value={message} />
				<button>보내기</button>
			</form>
		</>
	);
};

export default LiveChat;
