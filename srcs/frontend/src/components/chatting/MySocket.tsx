import { io, Socket } from 'socket.io-client'
import { SERVER_PORT } from './types'

export default class MySocket {
    private socket :Socket;
    public static instance :MySocket = new MySocket();

	public name :string = "Unknown";

    private constructor() {
        this.socket = io(`http://localhost:${SERVER_PORT}`, {
            transports: ['websocket']
          });
    }

    public emit(type :string, info :any) {
        this.socket.emit(type, info);
    }
    public on(type :string, func :any) {
        this.socket.on(type, func);
    }
}