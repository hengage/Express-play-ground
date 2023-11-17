import { Server } from "http";

const socketIO = require('socket.io');
import { Socket } from "socket.io";

class InitializeWebSocket {
    public async connectSocket(server: Server ) {
        const io = socketIO(server);

        io.on('connection', (socket: Socket) =>{
            console.log('User connected')

            socket.on('message', (message) =>{
                console.log('Message received', message)
            })

            socket.on('disconnect', () =>{
                console.log('User disconnected')
            })
        })
    }
}

export const initializeWebSocket = new InitializeWebSocket()