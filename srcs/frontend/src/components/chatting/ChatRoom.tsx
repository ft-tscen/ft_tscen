import { useEffect, useRef } from "react";
import { Row } from "react-bootstrap";
import { Message } from "./types";
import { Chat } from "./Chat";

export function ChatRoom({msgList} :{msgList :Message[]}) {
  const chatWindow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindow.current) {
      chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
    }
  }, [msgList]);

  return (
		<Row
      className="w-100 m-0 mt-auto"
      ref={chatWindow}>
      {
        msgList.map((msg :Message, idx :number) => {
          return (
            <Chat msg={msg} key={idx}/>
          );
        })
      }
		</Row>
	);
}