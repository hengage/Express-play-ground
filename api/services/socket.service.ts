import { Server } from "http";

const socketIO = require('socket.io');
import { Socket } from "socket.io";

class InitializeWebSocket {
    public async connectSocket(server: Server ) {
        const io = socketIO(server);

        let vendor: string;
        io.on('connection', (socket: Socket) =>{
            console.log('User connected')

            socket.on('message', (message) =>{
                console.log('Message received', message)
            })

            socket.on('create-vendor-room', async (message) =>{
                vendor = message.vendorId
                console.log('Message received', message.vendorId)
                socket.join(message.vendorId)
            })

          

            socket.on('disconnect', () =>{
                console.log('User disconnected')
                socket.leave(vendor)
            })
        })
    }
}

export const initializeWebSocket = new InitializeWebSocket()