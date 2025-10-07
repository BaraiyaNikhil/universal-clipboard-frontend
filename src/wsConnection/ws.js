import {io} from "socket.io-client";

export function socketConnection(){
    return io("http://localhost:3000");
}