import { io, Socket } from 'socket.io-client'
import { SERVER_PORT, SocketOutputDto } from './types'

export default class MySocket {
    private socket :Socket;
    public static instance :MySocket = new MySocket();

	public name :string = "Unknown" + parseInt((Math.random() * 100).toString()).toString();
    public enteredChannelName :string|undefined;

    private constructor() {
        this.socket = io(`http://localhost:${SERVER_PORT}/chat`, {
            withCredentials :true,
            query :{
                nickname : this.name
            }
            });
    }

    public emit(type :string, info :SocketOutputDto, func :any) {
        this.socket.emit(type, info, func);
    }
    public emit_func(type :string, func :any) {
        this.socket.emit(type, func);
    }
    public on(type :string, func :any) {
        this.socket.on(type, func);
    }
    public off(type :string, func :any) {
        this.socket.off(type, func);
    }
}