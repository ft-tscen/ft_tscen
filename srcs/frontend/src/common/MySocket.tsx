import { io, Socket } from 'socket.io-client'

interface MySocket {
  socket: Socket;
  name: string;
  enteredChannelName: string;
  enteredGameRoom: string;
}

export let mySocket: MySocket;

export function SetSocket(newName: string) {
  mySocket = {
    socket: io(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/chat`, {
      withCredentials: true,
      query: {
        nickname: newName,
      },
    }),
    name: newName,
    enteredChannelName: "",
    enteredGameRoom: "",
  };
}