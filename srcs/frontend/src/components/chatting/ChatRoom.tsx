import { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
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
		<Container
      className="mt-auto Scrollable"
      ref={chatWindow}
      style={{flex:"1"}}>
      {
        msgList.map((msg :Message, idx :number) => {
          return (
            <Chat msg={msg} key={idx}/>
          );
        })
      }
		</Container>
	);
}